// routes/task.js
const express = require('express');
const router = express.Router();
const knexconf = require('../knexconf')
const auth = require('..//middleware/auth')
const os = require('os');

// read the states
router.get('/system', auth.isLoggedIn, (req, res) =>{
  system = {}
  system.serverEnv = process.env
  system.knexconf = knexconf
  system.hostname = os.hostname();
  system.cpus = os.cpus()
  system.totalmem = os.totalmem()
  system.osType = os.type()
  system.platform = os.platform()
  system.uptime = os.uptime()
  system.networkInterfaces = os.networkInterfaces()

  res.json(system)
})

module.exports = router;