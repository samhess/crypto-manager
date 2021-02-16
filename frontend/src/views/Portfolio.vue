<template>
  <div class="portfolio">
    <h1>Portfolio</h1>
    <div class="alert alert-primary text-center" role="alert">
      Portfolio Value: {{Number((portfolio.value).toFixed(1)).toLocaleString('de-CH')}} USD
    </div>
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary text-white" @click="editItem()">Add Coin</button>
    </div>
    <table class="table">
      <caption>Portfolio</caption>
      <thead>
        <tr>
          <th v-for="header in portfolio.headers" 
              :key="header.value" 
              :class="['amount', 'price', 'value', 'mshare', 'share', 'action'].includes(header.value) ? 'text-end':''" 
              scope="col">{{header.text}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in portfolio.coins" :key="coin.symbol">
          <td>{{coin.cmc_rank}}</td>
          <td>{{coin.name}}</td>
          <td>{{coin.symbol}}</td>
          <td class="text-end">{{coin.amount}}</td>
          <td class="text-end">{{coin.price.toLocaleString('de-CH', {style:'currency', currency:'USD'})}}</td>
          <td class="text-end">{{coin.val.toLocaleString('de-CH', {style:'currency', currency:'USD'})}}</td>
          <td class="text-end">{{coin.mshare.toFixed(1) +'%'}}</td>
          <td class="text-end">{{coin.share.toFixed(1) +'%'}}</td>
          <td class="text-end">
            <button class="btn btn-primary text-white me-2" @click="editItem(coin)">Edit</button>
            <button class="btn btn-danger text-white" @click="deleteItem(coin)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <dialog id="dialog">
      <h2 class="h3 d-flex justify-content-center">Coin</h2>
      <div class="mb-2">
        <label class="form-label" for="lastname">Symbol</label>
        <input id="symbol" class="form-control" v-model="editedItem.symbol"/>
      </div>
      <div class="mb-2">
        <label class="form-label" for="firstname">Amount</label>
        <input id="amount" class="form-control" v-model="editedItem.amount"/>
      </div>
      <menu class="d-flex justify-content-end pt-2 mb-1">
        <button class="btn btn-secondary" @click="dialog('dialog','close')">Abbrechen</button>&nbsp;
        <button class="btn btn-primary text-white" @click="saveItem">Speichern</button>
      </menu>
    </dialog>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { dialog } from '../lib/utils'
import httpHeaders from '../lib/auth'
export default {
  name: 'portfolio',
  props: ['user'],

  setup() {
    const portfolio = reactive({
      coins : [],
      value : 0,
      headers : [
        { text: 'Rank', value: 'cmc_rank'},
        { text: 'Name', value: 'name'},
        { text: 'Symbol', value: 'symbol'},
        { text: 'Amount', value: 'amount'},
        { text: 'Price', value: 'price'},
        { text: 'Value', value: 'value'},
        { text: 'Market Share', value: 'mshare'},
        { text: 'Portfolio Share', value: 'share'},
        { text: 'Action', value: 'action'}
      ]
    })
    const editedItem = reactive({})
    const marketGlobals = {}

    function editItem(item) {
      dialog('dialog','open')
      // edit
      if (item)
        Object.assign(editedItem, item)
      // new
      else {
        Object.keys(editedItem).forEach(k => editedItem[k] = null)
      }
    }

    async function saveItem() {
      // new item
      if (editedItem.id === undefined) {
        let opt = { ...httpHeaders, method:'POST', body:JSON.stringify(editedItem)}
        await fetch('/api/portfolio/add', opt)
      }
      // update item
      else { 
        let opt = {...httpHeaders, method:'PUT', body:JSON.stringify(editedItem)}
        await fetch('/api/portfolio/edit', opt)
      }
      dialog('dialog','close')
      getPortfolio()
    }
    
    async function deleteItem(item) {
      if (confirm('Are you sure you want to delete your ' + item.symbol + ' position?')) {
        await fetch(`/api/portfolio/delete/${item.id}`, {method:'DELETE'})
        getPortfolio()
      }
    }

    async function getMarketGlobals() {
      let response = await fetch('/api/coin/market/update')
      let data = await response.json()
      Object.assign(marketGlobals,data)
      getPortfolio()
    }

    async function getPortfolio() {
      let response = await fetch('/api/portfolio')
      portfolio.coins = await response.json()
      // sum the portfolio
      portfolio.value = portfolio.coins.reduce((accumulator, coin) => accumulator + coin.val, 0)
      // add properties market share and portfolio share to each coin
      portfolio.coins.map(coin => {
        let marketCap = marketGlobals.quote.USD.total_market_cap
        coin.mshare = 100 * coin.market_cap / marketCap
        coin.share = 100 * coin.val / portfolio.value
        return coin
      })
    }

    getMarketGlobals()

    return {
      portfolio,
      marketGlobals,
      editedItem,
      dialog,
      saveItem,
      editItem,
      deleteItem
    }
  }
}
</script>