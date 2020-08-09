// routes/home.js
const express = require('express');
const home = express.Router();

endpoints = [{
    name:'/api',
    operations:'Show this test page',
    path:'/api',
    methods:'GET'
  },{
    name:'/api/coin',
    operations:'R coins',
    path:'/api/coin',
    methods:'GET, UPDATE'
  },
  {
    name:'/api/portfolio',
    operations:'CRUD tasks',
    path:'/api/portfolio',
    methods:'POST, GET, UPDATE, DELETE'
  },{
    name:'/api/portfolio/getByUser/:id',
    operations:'R positions of a certain user',
    path:'/api/portfolio/getByUser/1',
    methods:'GET'
  },{
    name:'/api/user',
    operations:'CRUD users',
    path:'/api/user',
    methods:'POST, GET, UPDATE, DELETE'
  },
  {
    name:'/api/user/login',
    operations:'Get a WebToken',
    path:'/api/user/login',
    methods:'POST'
  }
]

home.get('/', (req, res) => {
    var html = '<head>'
    html += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">'
    html += '</head><body><div class="container"><br>'
    html += '<h1>Welcome to Todo-API</h1>'
    html += '<p>To access these endpoints you need a valid session exept for /api. Your client (browser, Postman, axios, etc.) must include a valid bearer token in the authorization field of the http header!</p>'
    html += '<table class="table"><tr>'
    html += '<th>Endpoint</th>'
    html += '<th>HTTP methods</th>'
    html += '<th>Operations</th></tr>'
    endpoints.forEach(point => {
      html += "<tr><td><a href="
      html += point.path
      html += ">"
      html += point.name
      html += "</a></td><td>"
      html += point.methods
      html += "</td><td>"
      html += point.operations
      html += "</td></tr>"

    });
    html += '</table></div></body>'
    res.send(html)
  })

  module.exports = home;