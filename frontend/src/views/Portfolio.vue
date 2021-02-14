<template>
  <div class="portfolio">
    <h1>Portfolio</h1>
    <p>Value: {{portfolioValue.toFixed(0)}} USD</p>
    <button class="btn btn-primary text-white me-2" @click="updatePrices">Update Prices</button>
    <button class="btn btn-primary text-white me-2" @click="updateGlobals">Update Globals</button>
    <table class="table">
      <caption>Portfolio</caption>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" scope="col">{{header.text}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in portfolio" :key="coin">
          <td>{{coin.cmc_rank}}</td>
          <td>{{coin.name}}</td>
          <td>{{coin.symbol}}</td>
          <td>{{coin.amount}}</td>
          <td>{{coin.price.toFixed(2)}}</td>
          <td>{{coin.value.toFixed(0)}}</td>
          <td>{{coin.mshare.toFixed(1) +'%'}}</td>
          <td>{{coin.share.toFixed(1) +'%'}}</td>
          <td>{{coin.action}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
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
        { text: 'Market Share', value: 'mshare', align: 'end',},
        { text: 'Share', value: 'share', align: 'end',},
        { text: 'Action', value: 'action', align: 'end',},
      ],
      dialog: false,
      editedItem : {},
      editedIndex : -1,
      snack: false,
      snackColor: '',
      snackText: '',
      maxchars: v => v.length <= 11 || 'Input too long!',
      coins: [],
      portfolio: [],
      portfolioValue: 0,
      marketCapitatlization: 387300 * 1000000,
      marketGlobals: {}
    };
  },
  methods: {
    async updatePrices() {
      let response = await fetch('/api/coin/update')
      let data = await response.json()
      console.log(data)
    },
    async updateGlobals() {
      let response = await fetch('/api/coin/market/update')
      let data = await response.json()
      this.marketGlobals = data
      this.marketCapitatlization = data.quote.USD.total_market_cap
    },
    async save (item) {
      var idx = this.portfolio.indexOf(item)
      this.portfolio[idx].value = item.amount * item.price
      let response = await fetch('/api/portfolio', {method:'PUT', body:JSON.stringify(item)})
      let data = await response.json()
      if (data === 1) {
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
      console.log(this.editedItem)
      fetch('/api/portfolio', {method:'POST', body:JSON.stringify(this.editedItem)})
        .then(response => {
          var id = response.data[0]
          if (id) {
            var coinData = this.coins.find(el => el.symbol === this.editedItem.symbol)
            this.portfolio.push({
              'positionId' : id,
              'cmc_rank' : coinData.cmc_rank,
              'name': coinData.name,
              'symbol' : this.editedItem.symbol,
              'amount' : this.editedItem.amount,
              'price': coinData.price,
              'value': this.editedItem.amount * coinData.price
            })
          }
        })
    },
    editItem (item) {
        this.editedIndex = this.portfolio.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },
    deleteItem(item) {
      var index = this.portfolio.indexOf(item)
      if (confirm('Are you sure you want to delete your ' + item.name + ' position?')) {
        this.portfolio.splice(index, 1)
        fetch(`/api/portfolio/${item.id}`, {method:'DELETE'})
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  async mounted() {
    await this.updateGlobals()
    let response = await fetch('/api/portfolio')
    this.portfolio = await response.json()
    // console.log(this.portfolio)
    this.portfolio.map(coin => {
      coin.value = parseFloat(coin.amount) * parseFloat(coin.price)
      this.portfolioValue += parseFloat(coin.value)
      return coin
    })
    this.portfolio.map(coin => {
      coin.mshare = (parseFloat(coin.market_cap) / this.marketCapitatlization * 100)
      coin.share = (100 * coin.value / this.portfolioValue)
      return coin
    })
  }
}
</script>