<template>
  <div class="portfolio">
    <h1>Portfolio</h1>
    <div class="alert alert-primary text-center" role="alert">
      Portfolio Value: {{Number((portfolio.value).toFixed(1)).toLocaleString('de-CH')}} USD
    </div>
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary text-white me-2" @click="editItem()"><i class="bi-plus-square"></i></button>
      <button class="btn btn-danger text-white" @click="deleteItem('all')"><i class="bi-trash"></i></button>
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
          <td>{{coin.ranking}}</td>
          <td>{{coin.name}}</td>
          <td>{{coin.symbol}}</td>
          <td class="text-end">{{coin.amount}}</td>
          <td class="text-end">{{coin.price.toLocaleString('de-CH', {style:'currency', currency:'USD'})}}</td>
          <td class="text-end">{{coin.val.toLocaleString('de-CH', {style:'currency', currency:'USD'})}}</td>
          <td class="text-end">{{coin.mshare.toFixed(2) +'%'}}</td>
          <td class="text-end">{{coin.share.toFixed(2) +'%'}}</td>
          <td class="text-end">
            <button class="btn btn-primary text-white me-2" @click="editItem(coin)"><i class="bi-pencil-square"></i></button>
            <button class="btn btn-danger text-white" @click="deleteItem(coin)"><i class="bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    <dialog id="dialog">
      <h2 class="h3 d-flex justify-content-center">Coin</h2>
      <div class="mb-2">
        <label class="form-label" for="lastname">Symbol</label>
        <select id="selectCoin" class="form-select" v-model="editedItem.coinId">
          <option v-for="coin in coins" :key="coin.id" :value="coin.id">{{coin.symbol}}</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="form-label" for="firstname">Amount</label>
        <input id="amount" class="form-control" type="number" v-model="editedItem.amount"/>
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
  props: {
    user: Object
  },

  setup(props) {
    const portfolio = reactive({
      coins : [],
      value : 0,
      headers : [
        { text: 'Rank', value: 'ranking'},
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
    const coins = reactive({})
    const editedItem = reactive({})
    const marketGlobals = {}

    function editItem(item) {
      dialog('dialog','open')
      // edit
      if (item) {
        Object.assign(editedItem, item)
        document.getElementById('selectCoin').setAttribute('disabled', 'disabled')
      }
      // new
      else {
        Object.keys(editedItem).forEach(key => delete editedItem[key])
        document.getElementById('selectCoin').removeAttribute('disabled')
      }
    }

    async function saveItem() {
      let opt = { ...httpHeaders, body:JSON.stringify(editedItem)}
       // new item since there is no id available
      if (editedItem.id === undefined) {
        opt.method = 'POST'
        await fetch(`/api/portfolio/${props.user.id}/add/`, opt)
      }
      // update item
      else { 
        opt.method = 'PUT'
        await fetch(`/api/portfolio/${props.user.id}/edit`, opt)
      }
      dialog('dialog','close')
      getPortfolio()
    }
    
    async function deleteItem(item) {
      if (item === 'all') {
        if (confirm('Are you sure you want to delete all your positions?')) {
          await fetch(`/api/portfolio/${props.user.id}/delete`, {method:'DELETE'})
        }
      } else {
        if (confirm('Are you sure you want to delete your ' + item.symbol + ' position?')) {
          await fetch(`/api/portfolio/${props.user.id}/delete/${item.id}`, {method:'DELETE'})
        }
      }
      getPortfolio()
    }

    async function getMarketGlobals() {
      let response = await fetch('/api/coin/market/update')
      let data = await response.json()
      Object.assign(marketGlobals,data)
      getPortfolio()
    }

    async function getPortfolio() {
      let response = await fetch(`/api/portfolio/${props.user.id}`)
      portfolio.coins = await response.json()
      // sum the portfolio
      portfolio.value = portfolio.coins.reduce((accumulator, coin) => accumulator + coin.val, 0)
      // add properties market share and portfolio share to each coin
      portfolio.coins.map(coin => {
        let marketCap = marketGlobals.quote.USD.total_market_cap
        coin.mshare = 100 * coin.marketcap / marketCap
        coin.share = 100 * coin.val / portfolio.value
        return coin
      })
    }

    async function getCoins() {
      let response = await fetch(`/api/coin/symbol`)
      let data = await response.json()
      Object.assign(coins,data)
    }

    getMarketGlobals()
    getCoins()

    return {
      coins,
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