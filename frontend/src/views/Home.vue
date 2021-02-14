<template>
  <div class="home">
    <h1>Welcome to Crypto Manager!</h1>
    <table class="table">
      <caption>Coin Market</caption>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" scope="col">{{header.text}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in coins" :key="coin">
          <td>{{coin.cmc_rank}}</td>
          <td>{{coin.name}}</td>
          <td>{{coin.symbol}}</td>
          <td>{{coin.price}}</td>
          <td>{{coin.percent_change_1h+'%'}}</td>
          <td>{{coin.percent_change_24h+'%'}}</td>
          <td>{{coin.percent_change_7d+'%'}}</td>
          <td>{{coin.share}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
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
    let response = await fetch('/api/coin')
    this.coins = await response.json()
    this.coins.map(coin => {
      coin.share = (Number(coin.market_cap) / 1363827811878 * 100).toFixed(2) + '%'
      return coin
    })
  }
}
</script>
