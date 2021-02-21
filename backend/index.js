const express = require('express')
const app = express()
// take port from environment variable if present
const port = process.env.PORT || 80 
const fallback = require('./middleware/fallback')
const logger = require('./middleware/logger')

// user logger
app.use(logger)

// use express built-in JSON body parser
app.use(express.json())

// add routes
app.use('/api/coin', require('./endpoints/coin'))
app.use('/api/portfolio', require('./endpoints/portfolio'))
// app.use('/api/user', require('./endpoints/user'))

// serve GUI as static content (index.html)
app.use(express.static(`${__dirname}/../frontend/dist`))
app.use(fallback)

// start server
app.listen(port, console.log(`Serving GUI at http://localhost:${port}/ and REST API at http://localhost:${port}/api`))