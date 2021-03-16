const express = require('express')
const router = express.Router()
const env = process.env.NODE_ENV || 'development'
const knexconf = require('../db/knexfile')[env]
const knex = require('knex')(knexconf)
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'Geheimnis'

// read user
router.get('/', async (req, res) =>{
  let results = await knex('user')
  res.json(results)
})

// delete user
router.delete('/delete/:id', (req, res) => {
  let id = req.params.id
  knex('user').delete().where({id})
    .then(() => {
      res.json(results)
    })
    .catch(err => {
      res.json(err)
    })
})

// change password
router.put('/update/:id', async (req, res) => {
  let changedUser = req.body
  let user = await knex('user').where({username:changedUser.username}).first()
  let isequal = await bcrypt.compare(changedUser.password, user.password)
  if (isequal && changedUser.newPassword === changedUser.newPasswordRepeat) {
    var hash = await bcrypt.hashSync(changedUser.newPassword)
    let results = await knex('user')
      .update({password: hash})
      .where('username', changedUser.username)
    .then(()=> {
      res.json(results)
    })
    .catch(err => {
      console.log(err)
      res.json(err)
    })
  } else {
    console.log('password change denied');
  }
})

router.post('/register', (req, res) => {
  let user = req.body
  user.password = bcrypt.hashSync(user.password)
  user.status = 'enabled'
  knex('users').insert(user)
    .then((results) => {
      res.json(results)
    })
    .catch(err => {
      if (err.code === 'ER_DUP_ENTRY') {
        res.json({message:'User already exists!'})
      } else {
        console.log(err)
        res.json(err)
      }
    })
})

router.post('/login', (req,res)=> {
  let credentials = req.body
  if (credentials.username && credentials.password) {
    knex('users').where('username', credentials.username).first()
      .then(user => {
        if (user && bcrypt.compareSync(credentials.password,user.password)) {
          let {id,username,role} = user
          let payload = {id, username, role}
          let token = jwt.sign(payload, jwtSecret, {expiresIn: "1h"})
          res.json({token})
        } else {
          res.json({message: 'Username or password is incorrect!'})
        }
      })
      .catch(err => {
        console.error(err.message)
        res.status(500)
        res.json(err.message)
      })
  } else {
    res.json({message: 'no valid body'})
  }
})



module.exports = router