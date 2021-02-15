<template>
  <div class="home">
    <h1>Welcome to Crypto Manager!</h1>
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary text-white me-2" @click="updatePrices">Update Market Data</button>
    </div>
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
          <td :class="getColor(coin.percent_change_1h)">{{coin.percent_change_1h+'%'}}</td>
          <td :class="getColor(coin.percent_change_24h)">{{coin.percent_change_24h+'%'}}</td>
          <td :class="getColor(coin.percent_change_7d)">{{coin.percent_change_7d+'%'}}</td>
          <td>{{coin.share.toFixed(2) + '%'}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { reactive } from 'vue';
export default {
  name: 'home',
  props: ['user'],
  setup() {
    const headers = reactive([
      { text: 'Rank', value: 'cmc_rank'},
      { text: 'Name', value: 'name'},
      { text: 'Symbol', value: 'symbol'},
      { text: 'Price', value: 'price'},
      { text: 'Change 1h', value: 'percent_change_1h'},
      { text: 'Change 24h', value: 'percent_change_24h'},
      { text: 'Change 7d', value: 'percent_change_7d'},
      { text: 'Share', value: 'share'}
    ])
    const coins = reactive([])
    const marketGlobals = {}

    async function updatePrices() {
      await fetch('/api/coin/update')
      getCoins()
    }
    
    function getColor(val) {
      var change = parseFloat(val)
      return (change <= 0) ? 'text-danger' : 'text-success'
    }

    async function getMarketGlobals() {
      let response = await fetch('/api/coin/market/update')
      let data = await response.json()
      Object.assign(marketGlobals,data)
      getCoins()
    }

    async function getCoins() {
      let response = await fetch('/api/coin')
      let data = await response.json()
      coins.length = 0
      coins.push(...data)
      let marketCap = marketGlobals.quote.USD.total_market_cap
      coins.map(coin => {
        coin.share = 100 * coin.market_cap / marketCap
        return coin
      })
    }

    getMarketGlobals()
    
    return {
      headers,
      coins,
      updatePrices,
      getColor
    }
  }
}
</script>
