// routes/task.js
const express = require('express');
const router = express.Router();
const knexconf = require('../knexconf')
const knex = require('knex')(knexconf)
const auth = require('../middleware/auth')


// read the positions
router.get('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var result = await knex('holdings')
  res.json(result)
})

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

router.put('/portfolio', auth.isLoggedIn, async (req, res) =>{
  var result = await knex('portfolio')
                  .update(
                    'amount', req.body.amount
                  ).where('positionId',req.body.positionId)
  res.json(result)
})


module.exports = router;