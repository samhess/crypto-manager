// routes/task.js
const express = require('express');
const router = express.Router();
const knexconf = require('../database/knexfile')['development']
const knex = require('knex')(knexconf)
const auth = require('../middleware/auth')


// read all positions
router.get('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var result = await knex('portfolio')
        .join('coins', 'portfolio.coinId', '=', 'coins.id')
        .select('portfolio.id', 'portfolio.amount', 'coins.cmc_rank', 'coins.name' , 'coins.symbol', 'coins.price')
        .orderBy('cmc_rank')
  res.json(result)
})

// add a position
router.post('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var coin = await knex('coins').where('symbol',req.body.symbol)
  var result = await knex('portfolio')
                  .insert({
                    'amount': req.body.amount,
                    'coinId': coin[0].id,
                    'userId': 1
                  })
  res.json(result)
})

// change a position
router.put('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var result = await knex('portfolio')
                  .update(
                    'amount', req.body.amount
                  ).where('positionId',req.body.positionId)
  res.json(result)
})

// delete a position
router.delete('/portfolio/:positionId', auth.isLoggedIn, async (req, res) =>{
  var results = await knex('portfolio')
                      .where('id', req.params.positionId)
                      .del()
  res.json(results)
})


module.exports = router;