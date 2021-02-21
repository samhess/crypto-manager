const path = require('path')
const webroot = path.join(__dirname, '../../frontend/dist')

// send always index.html for non-API requests
module.exports = function fallback(req, res, next) {
  if (req.path.indexOf('/api') !== 0){
    if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {   
      res.sendFile(`${webroot}/index.html`)
    } else {
      res.json('No handler for this request type defined')
    }
  } else next(); // API request
}