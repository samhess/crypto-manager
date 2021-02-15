<template>
  <div class="portfolio">
    <h1>Portfolio</h1>
    <div class="alert alert-primary" role="alert">
       Portfolio Value: {{Number((portfolioValue).toFixed(1)).toLocaleString('de-CH')}} USD
    </div>
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary text-white" @click="editItem()">Add Coin</button>
    </div>
    <table class="table">
      <caption>Portfolio</caption>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.value" :class="(header.value==='action') ? 'text-end':''" scope="col">{{header.text}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in portfolio" :key="coin.symbol">
          <td>{{coin.cmc_rank}}</td>
          <td>{{coin.name}}</td>
          <td>{{coin.symbol}}</td>
          <td>{{coin.amount}}</td>
          <td>{{coin.price.toFixed(2)}}</td>
          <td>{{coin.val.toFixed(0)}}</td>
          <td>{{coin.mshare.toFixed(1) +'%'}}</td>
          <td>{{coin.share.toFixed(1) +'%'}}</td>
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
        <button class="btn btn-secondary" @click="closeDialog('dialog')">Abbrechen</button>&nbsp;
        <button class="btn btn-primary text-white" @click="saveItem">Speichern</button>
      </menu>
    </dialog>
  </div>
</template>
<script>
import { reactive, ref } from 'vue'
import { openDialog, closeDialog } from '../lib/utils'
import httpHeaders from '../lib/auth'
export default {
  name: 'portfolio',
  props: ['user'],

  setup() {
    const headers = reactive([
      { text: 'Rank', value: 'cmc_rank'},
      { text: 'Name', value: 'name'},
      { text: 'Symbol', value: 'symbol'},
      { text: 'Amount', value: 'amount'},
      { text: 'Price', value: 'price'},
      { text: 'Value', value: 'value'},
      { text: 'Market Share', value: 'mshare'},
      { text: 'Share', value: 'share'},
      { text: 'Action', value: 'action'}
    ])
    const coins = reactive([])
    const portfolio = reactive([])
    var portfolioValue = ref(0)
    const marketGlobals = {}
    const editedItem = reactive({})
    var editedIndex = ref(0)

    async function getMarketGlobals() {
      let response = await fetch('/api/coin/market/update')
      let data = await response.json()
      Object.assign(marketGlobals,data)
      getPortfolio()
    }

    function editItem(item) {
      openDialog('dialog')
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
      closeDialog('dialog')
      getPortfolio()
    }
    
    async function deleteItem(item) {
      if (confirm('Are you sure you want to delete your ' + item.symbol + ' position?')) {
        await fetch(`/api/portfolio/delete/${item.id}`, {method:'DELETE'})
        getPortfolio()
      }
    }

    async function getPortfolio() {
      let response = await fetch('/api/portfolio')
      let items = await response.json()
      portfolio.length = 0
      portfolio.push(...items)
      portfolioValue.value = 0
      portfolio.forEach(coin => {
        portfolioValue.value += coin.val
      })
      portfolio.map(coin => {
        let marketCap = marketGlobals.quote.USD.total_market_cap
        coin.mshare = 100 * coin.market_cap / marketCap
        coin.share = 100 * coin.val / portfolioValue.value
        return coin
      })
    }

    getMarketGlobals()

    return {
      headers,
      coins,
      portfolio,
      editedItem,
      editedIndex,
      portfolioValue,
      saveItem,
      openDialog,
      closeDialog,
      editItem,
      deleteItem
    }
  }
}
</script>