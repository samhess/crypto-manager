<template>
  <div class="home">
    <h1>Welcome to Crypto Manager!</h1>
    <v-data-table :headers="headers" :items="coins" :items-per-page="20">
      <template v-slot:[`item.percent_change_1h`] = "{ item }">
        <v-chip :color="getColor(item.percent_change_1h)" dark>{{ item.percent_change_1h+'%' }}</v-chip>
      </template>
      <template v-slot:[`item.percent_change_24h`] = "{ item }">
        <v-chip :color="getColor(item.percent_change_24h)" dark>{{ item.percent_change_24h+'%' }}</v-chip>
      </template>
      <template v-slot:[`item.percent_change_7d`] = "{ item }">
        <v-chip :color="getColor(item.percent_change_7d)" dark>{{ item.percent_change_7d+'%' }}</v-chip>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'home',
  props: ['user'],
  data() {
    return {
      headers: [
        { text: 'Rank', value: 'cmc_rank', align: 'left',},
        { text: 'Name', value: 'name', align: 'left',},
        { text: 'Symbol', value: 'symbol', align: 'left',},
        { text: 'Price', value: 'price', align: 'end',},
        { text: 'Change 1h', value: 'percent_change_1h', align: 'end',},
        { text: 'Change 24h', value: 'percent_change_24h', align: 'end',},
        { text: 'Change 7d', value: 'percent_change_7d', align: 'end',},
        { text: 'Share', value: 'share', align: 'end',}
      ],
      coins: []
    };
  },
  methods: {
    getColor (val) {
      var change = Number(val)
      if (change > 0) return 'green'
      else if (change <= 0) return 'red'
    },
  },
  async mounted() {
    this.coins = await axios.get('/api/coin')
      .then(response => { 
        var coins = response.data
        coins.map(coin => {
          coin.share = (Number(coin.market_cap) / 357000000000 * 100).toFixed(2) + '%'
        })
        return coins
      })
  }
}
</script>
