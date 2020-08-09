<template>
  <div class="portfolio">
    <h1>Portfolio {{portfolioValue.toFixed(0)}} USD</h1>
    <v-data-table :headers="headers" :items="portfolio" :items-per-page="10" >
      <!-- table top -->
      <template slot="top">
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <div align="right">
              <v-btn color="primary" dark v-on="on">ADD</v-btn>
            </div>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add coin</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select :items="coins" item-text="symbol" v-model="newItem.symbol" label="Coin"> </v-select>
                    <v-text-field v-model="newItem.amount" label="Amount"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveDialog">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- the actual data table -->
      <template v-slot:item.action="props">
        <v-icon small @click="deleteItem(props.item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.amount="props">
        <v-edit-dialog
          :return-value.sync="props.item.amount"
          @save="save(props.item)"
        > {{ props.item.amount }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.amount"
              :rules="[maxchars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
    <v-snackbar v-model="snack" :timeout="2000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'portfolio',
  props: ['user'],
  data() {
    return {
      headers: [
        { text: 'Rank', value: 'cmc_rank', align: 'left',},
        { text: 'Name', value: 'name', align: 'left',},
        { text: 'Symbol', value: 'symbol', align: 'left',},
        { text: 'Amount', value: 'amount', align: 'end',},
        { text: 'Price', value: 'price', align: 'end',},
        { text: 'Value', value: 'value', align: 'end',},
        { text: 'Action', value: 'action', align: 'center',},
      ],
      dialog: false,
      newItem: {},
      snack: false,
      snackColor: '',
      snackText: '',
      maxchars: v => v.length <= 11 || 'Input too long!',
      coins: [],
      portfolio: [],
      portfolioValue: 0
    };
  },
  methods: {
    async save (item) {
      var idx = this.portfolio.indexOf(item)
      this.portfolio[idx].value = item.amount * item.price
      var res = await axios.put('/api/portfolio', item)
        .then(res => res.data)
        .catch(err => {
          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'Not saved: ' + err
        })
      if (res === 1) {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Saved in database'
      }
    },
    closeDialog () {
      this.dialog = false
    },
    saveDialog () {
      this.dialog = false
      axios.post('/api/portfolio', this.newItem)
        .then(response => {
          var id = response.data[0]
          if (id) {
            var coinData = this.coins.find(el => el.symbol === this.newItem.symbol)
            this.portfolio.push({
              'positionId' : id,
              'cmc_rank' : coinData.cmc_rank,
              'name': coinData.name,
              'symbol' : this.newItem.symbol,
              'amount' : this.newItem.amount,
              'price': coinData.price,
              'value': this.newItem.amount * coinData.price
            })
          }
        })
    },
    deleteItem(item) {
      var index = this.portfolio.indexOf(item)
      if (confirm('Are you sure you want to delete your ' + item.name + ' position?')) {
        this.portfolio.splice(index, 1)
        axios.delete(`/api/portfolio/${item.id}`)
      }
    }
  },
  async mounted() {
    this.portfolio = await axios.get('/api/portfolio')
      .then(response => {
        response.data.map(coin => {
          coin.value = (Number(coin.amount) * Number(coin.price)).toFixed(2)
          coin.price = Number(coin.price).toFixed(2)
          this.portfolioValue += Number(coin.value)
          return coin
        })
        return response.data
      })
    this.coins = await axios.get('/api/coin')
      .then(response => response.data)
  }
}
</script>
<style>
</style>