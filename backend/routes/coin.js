const express = require('express');
const router = express.Router();
const knexconf = require('../db/knexfile')['development']
const knex = require('knex')(knexconf)
const fetch = require('node-fetch')

router.get('/coin', async (req, res) =>{
  var result = await knex('coins').orderBy('ranking')
  res.json(result)
})

router.get('/coin/update', async (req, res) =>{
  let url = new URL('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
  url.search = new URLSearchParams({start:1, limit:100, convert:'USD'})
  let response = await fetch(url, {headers:{'X-CMC_PRO_API_KEY':'537aff70-7beb-4491-ae8e-852501fc9259'}})
  let data = await response.json()
  let coins = data.data.map(coin => {
    return {
      'id' : coin.id,
      'symbol' : coin.symbol,
      'name' : coin.name,
      'slug' : coin.slug,
      'ranking': coin.cmc_rank,
      'price': coin.quote.USD.price,
      'volume24h': coin.quote.USD.volume_24h,
      'change1h': coin.quote.USD.percent_change_1h,
      'change24h': coin.quote.USD.percent_change_24h,
      'change7d': coin.quote.USD.percent_change_7d,
      'marketCap': coin.quote.USD.market_cap,
    }
  })
  let columns = Object.keys(coins[0]).join(',')
  let values = coins.reduce((acc, current) => {
    let values = Object.values(current).map(x => `'${x}'`).join(',')
    return acc + `(${values}),`
  }, '')
  values = values.slice(0,-1)
  knex.raw(`
    INSERT INTO coins (${columns})
    VALUES ${values} ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    slug=VALUES(slug),
    ranking=VALUES(ranking),
    price=VALUES(price),
    volume24h=VALUES(volume24h),
    change1h=VALUES(change1h),
    change24h=VALUES(change24h),
    change7d=VALUES(change7d),
    marketCap=VALUES(marketCap)
  `)
  .catch((err) => {
    console.log('UPSERT error:', err.message);
  })
  .then(() => console.log('UPSERT done'))
})

router.get('/coin/market/update', async (req, res) =>{
  let url = new URL('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest')
  let response = await fetch(url, {headers : {'X-CMC_PRO_API_KEY': '537aff70-7beb-4491-ae8e-852501fc9259'}})
    .catch((err) => {
      console.log('API call error :', err.message);
    })
  let data = await response.json()
  res.json(data.data)
})

module.exports = router

globals = {
  active_cryptocurrencies: 4078,
  total_cryptocurrencies: 8477,
  active_market_pairs: 33779,
  active_exchanges: 365,
  total_exchanges: 1274,
  eth_dominance: 13.996670158649,
  btc_dominance: 60.530337273418,
  defi_volume_24h: 18307551460.02863,
  defi_volume_24h_reported: 33913960618.74969,
  defi_market_cap: 68731769907.36993,
  defi_24h_percentage_change: 7.233959738733,
  stablecoin_volume_24h: 164404830838.4666,
  stablecoin_volume_24h_reported: 310704344726.74945,
  stablecoin_market_cap: 51921213628.16141,
  stablecoin_24h_percentage_change: 6.967652166413,
  derivatives_volume_24h: 122990762550.87617,
  derivatives_volume_24h_reported: 122998132405.52116,
  derivatives_24h_percentage_change: 16.57375909882,
  quote: {
    USD: {
      total_market_cap: 1489188831182.366,
      total_volume_24h: 207830584350.18,
      total_volume_24h_reported: 390812731231.56,
      altcoin_volume_24h: 133991479863.61462,
      altcoin_volume_24h_reported: 243524925631.37683,
      altcoin_market_cap: 587777809029.604,
      last_updated: '2021-02-15T16:40:18.000Z'
    }
  },
  last_updated: '2021-02-15T16:40:18.000Z'
}

let someCoin = {
  id: 1727,
  name: 'Bancor',
  symbol: 'BNT',
  slug: 'bancor',
  num_market_pairs: 154,
  date_added: '2017-06-18T00:00:00.000Z',
  tags: [
    'marketplace',
    'decentralized-exchange',
    'defi',
    'payments',
    'amm'
  ],
  max_supply: null,
  circulating_supply: 127028419.94017613,
  total_supply: 127028419.94017613,
  platform: {
    id: 1027,
    name: 'Ethereum',
    symbol: 'ETH',
    slug: 'ethereum',
    token_address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c'
  },
  cmc_rank: 99,
  last_updated: '2021-02-15T18:13:07.000Z',
  quote: { USD: [Object] }
}