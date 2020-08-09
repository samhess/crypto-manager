// routes/user.js
const express = require('express')
const user = express.Router()
const knexconf = require('../knexconf')
const knex = require('knex')(knexconf)
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const jwtSecret = "SECRETKEY"

// read user
user.get('/user', auth.isLoggedIn, async (req, res) =>{
  let results = await knex('user')
  res.json(results)
})

// delete user
user.delete('/user/:id', auth.isLoggedIn, async (req, res) => {
  try {
    let results = await knex('user')
                        .where('id', req.params.id)
                        .del()
    res.json(results)
  } catch (err) {
    res.status(200).json(err)
  }
})

function validateRegister (req, res, next)  {
  // username min length 3
  if (!req.body.username || req.body.username.length < 2) {
    return res.status(400).send({
      msg: 'Please enter a username with at least 2 characters'
    });
  }
  // password min 6 chars
  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a password with at least 6 characters'
    });
  }
  // password (repeat) does not match
  if (
    !req.body.password_repeat ||
    req.body.password != req.body.password_repeat
  ) {
    return res.status(400).send({
      msg: 'Both passwords must match'
    });
  }
  next();
}

user.put('/user/:id', auth.isLoggedIn, async (req, res) => {
  var user = await knex('user').where('username', req.body.username).then(data => data[0])
  var isequal = await bcrypt.compare(req.body.password, user.password)
  if (isequal && req.body.newPassword === req.body.newPasswordRepeat) {
    try {
      var hash = await bcrypt.hash(req.body.newPassword, 10)
      let results = await knex('user')
        .update({
          password: hash,
        })
        .where('username', req.body.username)
      res.json(results)
    } catch (err) {
      res.status(200).json(err)
    }
  }
});

user.post('/user', validateRegister, async (req, res) => {
  let results = await knex('user')
                        .where('username', req.body.username)
  if (results.length) {
    return res.status(409).send({
      msg: 'This username is already in use!'
    });
  } else {
    // username is available
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).send({
          msg: err
        });
      } else {
        // has hashed pw => add to database
        var newUser = {
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: hash,
          registered: new Date()
        }
        // Postgres 11 does not yet support generated columns
        if (knexconf.client === 'postgres' || knexconf.client === 'pg') {
            newUser.fullname = newUser.firstname + ' ' + newUser.lastname
        }
        let results = await knex('user').insert(newUser)
        res.json(results)
      }
    });
  }
});


// support login also via GET request
user.use('/user/login', function (req, res, next) {
  if (req.method === 'GET') {
    if (req.query.username && req.query.password) {
      req.body.username = req.query.username
      req.body.password = req.query.password
      req.method = 'POST'
      next(); // forward to POST handler below
    } else {
      return res.json({"msg":"You must provide username and password in the query"})
    }
  }
  next();
});

user.post('/user/login', async (req, res) => {
  let results = await knex('user')
                        .where('username', req.body.username)
  if (!results.length) {
    return res.status(401).send({
      msg: 'Username or password is incorrect!'
    });
  } else {
    // check password
    var user = results[0]
    bcrypt.compare(req.body.password, user.password, async (bErr, bResult) => {
      // wrong password
      if (bErr) {
        return res.status(401).send({
          msg: 'Username or password is incorrect!'
        });
      }
      if (bResult) {
        const token = jwt.sign(
          {username: user.username, userId: user.id},
          jwtSecret, 
          {expiresIn: '1d'}
        );
        let results = await knex('user')
                              .update({
                                lastlogin: new Date()})
                              .where('id', user.id)
        return res.status(200).send({
          msg: 'Logged in!',
          token: token,
          user: user
        });
      } else {
        return res.status(401).send({
          msg: 'Username or password is incorrect!'
        });
      }
    });
  }
});

module.exports = user