<template>
  <div class="portfolio">
    <h1>Portfolio</h1>
    <v-data-table :headers="headers" :items="portfolio" :items-per-page="10" >
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
      <template v-slot:item.amount="props">
        <v-edit-dialog
          :return-value.sync="props.item.amount"
          @save="save(props.item)"
        > {{ props.item.amount }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.amount"
              :rules="[max25chars]"
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
        { text: 'Position', value: 'positionId'},
        { text: 'Name', value: 'name'},
        { text: 'Symbol', value: 'symbol'},
        { text: 'Amount', value: 'amount'},
        { text: 'Price', value: 'price'},
        { text: 'Value', value: 'value'},
      ],
      dialog: false,
      newItem: {},
      snack: false,
      snackColor: '',
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
      coins: [],
      portfolio: [],
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
    add () {
      this.portfolio.push({
        'id' : null,
        'symbol' :'NEW',
        'amount' : 0,
        'price' : 0,
        'value' : 0
      })
    },
    closeDialog () {
      this.dialog = false
    },
    saveDialog () {
      this.dialog = false
      axios.post('/api/portfolio', this.newItem)
        .then(response => {
          var id = response.data
          if (id) {
                  var coinData = this.coins.find(el => el.symbol === this.newItem.symbol)
                  this.portfolio.push({
                    'positionId' : id[0],
                    'name': coinData.name,
                    'symbol' : this.newItem.symbol,
                    'amount' : this.newItem.amount,
                    'price': coinData.price,
                    'value': this.newItem.amount * coinData.price
                  })
          }
        })
    }
  },
  async mounted() {
    this.portfolio = await axios.get('/api/portfolio')
      .then(response => response.data)
    this.coins = await axios.get('/api/coin')
      .then(response => response.data)
  }
}
</script>
<style>
</style>
