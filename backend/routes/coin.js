// routes/task.js
const express = require('express');
const router = express.Router();
const knexconf = require('../database/knexfile')['development']
const knex = require('knex')(knexconf)
const auth = require('../middleware/auth')

router.get('/coin', auth.isLoggedIn, async (req, res) =>{
  var result = await knex('coins')
  res.json(result)
})

router.get('/coin/update', auth.isLoggedIn, async (req, res) =>{
  const rp = require('request-promise');
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
    // console.log('API call response:', response);
    response.data.forEach((element,index) => {
      var coin = {
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


module.exports = router;