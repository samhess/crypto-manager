// routes/task.js
const express = require('express');
const router = express.Router();
const knexconf = require('../knexconf')
const knex = require('knex')(knexconf)
const auth = require('../middleware/auth')


// read all positions
router.get('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var result = await knex('holdings')
  res.json(result)
})

// add a position
router.post('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var coin = await knex('coin').where('symbol',req.body.symbol)
  var result = await knex('portfolio')
                  .insert({
                    'amount': req.body.amount,
                    'coinId': coin[0].coinId,
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
                      .where('positionId', req.params.positionId)
                      .del()
  res.json(results)
})


module.exports = router;