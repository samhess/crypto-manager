const fs = require('fs')

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
};

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('portfolio').del()
    .then(async function () {
      var headers = []
      const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('seeds/portfolio.csv')
      });
      lineReader.on('line', function (line) {
        const values = line.trim().replace(/\"/g,'').split(',')
        // console.log(values)
        if (headers.length) {
          var coin = {};
          for (i=0; i < values.length; i++) {
            coin[headers[i]] = values[i]
          }
          if (coin.Symbol === 'ONE2') coin.Symbol = 'ONE'
          if (coin.Symbol === 'ATOM2') coin.Symbol = 'ATOM'
          knex('coins').where('symbol',coin.Symbol).then(results => {
            if (results.length) {
              var rec = {
                "amount": coin.Anzahl,
                "coinID": results[0].id,
                "userID": 1
              }
              knex('portfolio').insert(rec).then(results => {
              })
            } else {
              console.log(`Coin ${coin.Symbol} not in database`)
            }
          })

        } else { // first line are headers
          headers = values
          // console.log(headers)
        }

      })
      await sleep(2000)
      return knex('portfolio').then(positions => {
        if (positions.length) {
          console.log(`OK: ${positions.length} positions inserted`)
        }
      })
    });
};
