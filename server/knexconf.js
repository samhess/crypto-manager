// select database here: 0..2
var db = 0
var databases = []
databases.push('mysql://root:sml12345@localhost:3306/crypto')
const databaseUrl = process.env.DATABASE_URL || databases[db]  // take DATABASE_URL via environment variable if available (e.g. at heroku)
const client = databaseUrl.split(':')[0]

module.exports = {
  client: client, 
  connection: databaseUrl
}