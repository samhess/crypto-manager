const express = require('express')
const router = express.Router()
const env = process.env.NODE_ENV || 'development'
const knexconf = require('../db/knexfile')[env]
const knex = require('knex')(knexconf)

// read all positions
router.get('/:uid', async (req, res) => {
  let uid = req.params.uid
  let result = await knex('portfolio')
    .select('portfolio.id', 
      'portfolio.amount', 
      'portfolio.coinId',
      'coins.ranking', 
      'coins.name' , 
      'coins.symbol', 
      'coins.price', 
      // portfolio.amount * coins.price AS val
      knex.raw('?? * ?? as val', ['portfolio.amount','coins.price']),  
      'coins.marketCap')
    .join('coins', 'portfolio.coinId', 'coins.id')
    .where('portfolio.userId', uid)
    .orderBy('ranking')
    .select()
  res.json(result)
})

// add a position
router.post('/:uid/add', async (req, res) => {
  let uid = req.params.uid
  let coin = req.body
  let result = await knex('portfolio')
    .insert({'amount':coin.amount, 'coinId':coin.coinId, 'userId':uid})
  res.json(result)
})

// edit a position
router.put('/:uid/edit', async (req, res) => {
  let uid = req.params.uid
  let coin = req.body
  let result = await knex('portfolio')
    .update('amount', coin.amount)
    .where('id',coin.id)
    .where('userId',uid)
  res.json(result)
})

// delete a position
router.delete('/:uid/delete/:id', async (req, res) => {
  let uid = req.params.uid
  let coinid = req.params.id
  let results = await knex('portfolio')
    .delete()
    .where('id', coinid)
    .where('userId',uid)
  res.json(results)
})

// delete all positions
router.delete('/:uid/delete', async (req, res) => {
  let uid = req.params.uid
  let results = await knex('portfolio')
    .delete()
    .where('userId',uid)
  res.json(results)
})

// import
router.post('/:uid/import', async (req, res) => {
  let uid = req.params.uid
  let positions = req.body
  positions.map(coin => {
    if (coin.Ticker === 'DOT2') coin.Ticker = 'DOT'
    if (coin.Ticker === 'UNI2') coin.Ticker = 'UNI'
    if (coin.Ticker === 'ONE2') coin.Ticker = 'ONE'
    if (coin.Ticker === 'ATOM2') coin.Ticker = 'ATOM'
    return coin
  })
  let symbols = positions.map(coin => coin.Ticker)
  let coinList = await knex('coins').select('id','symbol').whereIn('symbol', symbols)
  let records = positions.map(coin => {
    let foundCoin = coinList.find(item => item.symbol === coin.Ticker)
    if (foundCoin) {
      return {
        amount: parseFloat(coin.Anzahl),
        coinId: foundCoin.id,
        userId: uid
      }
    } else {
      console.log(`Cannot import ${coin.Ticker}`)
      return undefined
    }
  })
  records = records.filter(el => el != undefined)
  let results = await knex('portfolio').insert(records)
  res.json(results)
})

module.exports = router