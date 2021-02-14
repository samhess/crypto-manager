function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
};

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex('coins').del()
    .then(async function () {
      // Inserts seed entries
      var axios = require('../../node_modules/axios')
      axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', { 
        params: {
          'start': '1',
          'limit': '500',
          'convert': 'USD'
        },
        headers: {
          'X-CMC_PRO_API_KEY': '537aff70-7beb-4491-ae8e-852501fc9259'
        }
      }).then(response => {
        response.data.data.forEach((element,index) => {
          var coin = {
            'slug': element.slug,
            'name': element.name,
            'symbol' : element.symbol,
            'cmc_rank': element.cmc_rank,
            'price': element.quote.USD.price,
            'volume24h': element.quote.USD.volume_24h,
            'percent_change_1h': element.quote.USD.percent_change_1h,
            'percent_change_24h': element.quote.USD.percent_change_24h,
            'percent_change_7d': element.quote.USD.percent_change_7d,
            'market_cap': element.quote.USD.market_cap,
          }

          knex('coins').insert(coin)
            .then(result => {
              console.log(result)
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      await sleep(5000)
    });
}