/*
 * Author:      Samuel Hess
 * File name:   index.js
 * Version:     1.0
 * Description: main file of the server / API
 *              initialize express and other dependencies
 *              redirect requests to routing controllers
 *              serve GUI as static content
 *              test datbase connection
 *              catch uncaught exceptions
 */


const dotenv = require('dotenv')
dotenv.config()
 // take port from environment variable if present (e.g. at heroku)
const port = process.env.PORT || 80 
const express = require('express')
const app = express()

// logger
const logger = require('./middleware/logger')
app.use(logger)

// use express built-in JSON body parser
// note: multipart/form-data will not be parsed
app.use(express.json())

// add routes
app.use('/api', require('./routes/coin'));
app.use('/api', require('./routes/user'));
app.use('/api/portfolio', require('./routes/portfolio'));

// serve GUI as static content (index.html)
app.use(express.static(`${__dirname}/../frontend/dist`))
const fallback = require('./middleware/fallback')
app.use(fallback)

// start server
app.listen(port, console.log("Serving GUI at web root and API at /api on localhost port " + port))