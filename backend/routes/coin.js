const express = require('express');
const router = express.Router();
const knexconf = require('../database/knexfile')['development']
const knex = require('knex')(knexconf)
const auth = require('../middleware/auth')
const rp = require('request-promise')

router.get('/coin', async (req, res) =>{
  var result = await knex('coins').orderBy('cmc_rank')
  res.json(result)
})

router.get('/coin/update', async (req, res) =>{
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '500',
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': '537aff70-7beb-4491-ae8e-852501fc9259'
    },
    json: true,
    gzip: true
  };
  rp(requestOptions).then(response => {
    response.data.forEach((element,index) => {
      let coin = {
        'cmc_rank': element.cmc_rank,
        'price': element.quote.USD.price,
        'volume24h': element.quote.USD.volume_24h,
        'percent_change_1h': element.quote.USD.percent_change_1h,
        'percent_change_24h': element.quote.USD.percent_change_24h,
        'percent_change_7d': element.quote.USD.percent_change_7d,
        'market_cap': element.quote.USD.market_cap,
      }
      knex('coins').update(coin)
        .where('symbol',element.symbol)
        .then(result => {
          if (result === 0) {
            console.log('inserting: ', element.symbol);
            coin.symbol = element.symbol
            coin.name = element.name
            coin.slug = element.slug
            knex('coins').insert(coin).catch(err => {
              console.log(err)
            })
          }
        })
        .catch(err => {
        })
      // console.log('Coin:', index, element);
    });
    res.json(response.data)
  }).catch((err) => {
    console.log('API call error:', err.message);
  });
})

router.get('/coin/market/update', async (req, res) =>{
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
    headers: {
      'X-CMC_PRO_API_KEY': '537aff70-7beb-4491-ae8e-852501fc9259'
    },
    json: true
  };
  rp(requestOptions)
    .then(response => {
      res.json(response.data)
    })
    .catch((err) => {
      console.log('API call error :', err.message);
    });
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