const express = require('express')
const router = express.Router()
const knexconf = require('../db/knexfile')['development']
const knex = require('knex')(knexconf)

// read all positions
router.get('/', async (req, res) => {
  var result = await knex('portfolio')
    .select('portfolio.id', 
      'portfolio.amount', 
      'coins.ranking', 
      'coins.name' , 
      'coins.symbol', 
      'coins.price', 
      // portfolio.amount * coins.price AS val
      knex.raw('?? * ?? as val', ['portfolio.amount','coins.price']),  
      'coins.marketCap')
    .join('coins', 'portfolio.coinId', 'coins.id')
    .orderBy('ranking')
    .select()
  res.json(result)
})

// add a position
router.post('/add', async (req, res) => {
  console.log(req.body);
  var coin = await knex('coins').where('symbol',req.body.symbol).first()
  var result = await knex('portfolio')
    .insert({'amount': req.body.amount,'coinId': coin.id,'userId': 1})
  res.json(result)
})

// edit a position
router.put('/edit', async (req, res) => {
  let coin = req.body
  var result = await knex('portfolio')
    .update('amount', coin.amount)
    .where('id',coin.id)
  res.json(result)
})

// delete a position
router.delete('/delete/:id', async (req, res) => {
  var results = await knex('portfolio')
    .del()
    .where('id', req.params.id)
  res.json(results)
})

// delete all positions
router.delete('/delete', async (req, res) => {
  var results = await knex('portfolio').delete()
  res.json(results)
})

// import
router.post('/import', async (req, res) => {
  let positions = req.body
  positions.map(coin => {
    if (coin.Symbol === 'DOT2') coin.Symbol = 'DOT'
    if (coin.Symbol === 'UNI2') coin.Symbol = 'UNI'
    if (coin.Symbol === 'ONE2') coin.Symbol = 'ONE'
    if (coin.Symbol === 'ATOM2') coin.Symbol = 'ATOM'
    return coin
  })
  let symbols = positions.map(coin => coin.Symbol)
  let coinList = await knex('coins').select('id','symbol').whereIn('symbol', symbols)
  let records = positions.map(coin => {
    let foundCoin = coinList.find(item => item.symbol === coin.Symbol)
    if (foundCoin) {
      return {
        amount: parseFloat(coin.Anzahl),
        coinId: foundCoin.id,
        userId: 1
      }
    } else {
      console.log(`Cannot import ${coin.Symbol}`)
      return undefined
    }
  })
  records = records.filter(el => el != undefined)
  let results = await knex('portfolio').insert(records)
  res.json(results)
})

module.exports = router