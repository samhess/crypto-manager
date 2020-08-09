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

 // take port from environment variable if present (e.g. at heroku)
const port = process.env.PORT || 80 
const express = require('express')
const app = express()
const fallback = require('express-history-api-fallback')

// enable or disable server logging
// logs requests to console including their body 
// logging will be enabled if an environment variable nodemon_logging (defined by nodemon.json) exists
const logging = process.env.nodemon_logging || false
if (logging){
  var morgan = require('morgan') 
  morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
  app.use(morgan(':method :url :body :status'))
}

// use express built-in JSON body parser
// note: multipart/form-data will not be parsed
app.use(express.json())

// add home, task, user and system routes
app.use('/api', require('./routes/home'));
app.use('/api', require('./routes/portfolio'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/coin'));

// host GUI as static content
const root = `${__dirname}/../client/dist`
app.use(express.static(root))
app.use(fallback('index.html', { root }))

// start server
app.listen(port, console.log("Serving GUI at web root and API at /api on localhost port " + port))

// test db connection
const knexconf = require('./database/knexfile')['development']
const knex = require('knex')(knexconf)
knex.raw("SELECT VERSION();").then(function(res){
  console.log('Sucessfully conneted to ' + knexconf.connection.database + ' database')
}).catch(function(err) {
  console.error(err.stack);
})

// catch so far uncaught exceptions
process.on('uncaughtException', function (err) {
  console.error('Caught exception: ' + err);
});