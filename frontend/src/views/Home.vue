<template>
  <div class="home">
    <h1>Welcome to Crypto Manager!</h1>
    <div class="alert alert-primary text-center" role="alert">
      Market Cap: {{marketCap}} USD
    </div>
    <!--
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary text-white me-2" @click="updatePrices">Update</button>
    </div>-->
    <table class="table">
      <caption>Coin Market</caption>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" scope="col"
              :class="['price', 'change1h', 'change24h', 'change7d', 'share'].includes(header.value) ? 'text-end':''" 
          >{{header.text}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in coins" :key="coin">
          <td>{{coin.ranking}}</td>
          <td>{{coin.name}}</td>
          <td>{{coin.symbol}}</td>
          <td class="text-end">{{coin.price.toLocaleString('de-CH', {style:'currency', currency:'USD'})}}</td>
          <td :class="getColor(coin.change1h)">{{coin.change1h.toFixed(2) +'%'}}</td>
          <td :class="getColor(coin.change24h)">{{coin.change24h.toFixed(2) +'%'}}</td>
          <td :class="getColor(coin.change7d)">{{coin.change7d.toFixed(2) +'%'}}</td>
          <td class="text-end">{{coin.share.toFixed(2) + '%'}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { reactive, ref } from 'vue';
export default {
  name: 'home',
  props: ['user'],
  setup() {
    const headers = reactive([
      { text: 'Rank', value: 'ranking'},
      { text: 'Name', value: 'name'},
      { text: 'Symbol', value: 'symbol'},
      { text: 'Price', value: 'price'},
      { text: 'Change 1h', value: 'change1h'},
      { text: 'Change 24h', value: 'change24h'},
      { text: 'Change 7d', value: 'change7d'},
      { text: 'Share', value: 'share'}
    ])
    const coins = reactive([])
    const marketGlobals = {}
    var marketCap = ref(0)

    async function updatePrices() {
      await fetch('/api/coin/update')
      getCoins()
    }
    
    function getColor(change) {
      return (change <= 0) ? 'text-danger text-end' : 'text-success text-end'
    }

    async function getMarketGlobals() {
      let response = await fetch('/api/coin/market/update')
      let data = await response.json()
      Object.assign(marketGlobals,data)
      marketCap.value = Number((marketGlobals.quote.USD.total_market_cap).toFixed(0)).toLocaleString('de-CH')
      getCoins()
    }

    async function getCoins() {
      let response = await fetch('/api/coin')
      let data = await response.json()
      coins.length = 0
      coins.push(...data)
      let marketCap = marketGlobals.quote.USD.total_market_cap
      coins.map(coin => {
        coin.share = 100 * coin.marketcap / marketCap
        return coin
      })
    }

    getMarketGlobals()
    
    return {
      headers,
      coins,
      marketCap,
      updatePrices,
      getColor
    }
  }
}
</script>
