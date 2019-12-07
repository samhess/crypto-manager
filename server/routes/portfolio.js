// routes/task.js
const express = require('express');
const router = express.Router();
const knexconf = require('../knexconf')
const knex = require('knex')(knexconf)
const auth = require('../middleware/auth')
var dbType = knexconf.client;
if (knexconf.client === 'pg' ) {
  dbType = 'postgres'
} else if (knexconf.client === 'mysql2') {
  dbType = 'postgres'
}


// read the coins
router.get('/coin', auth.isLoggedIn, async (req, res) =>{
  var results = await knex('coin')
  res.json(results)
})

module.exports = router;