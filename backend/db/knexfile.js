let dburl = process.env.DATABASE_URL
let props = {} 
if (dburl) {
  props.user = dburl.split('://')[1].split(':').shift()
  props.password = dburl.split('@').shift().split(':').pop()
  props.host = dburl.split('@')[1].split(':').shift()
  props.database = dburl.split('/').pop()
}

// Update with your config settings.
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'crypto',
      user:     'root',
      password: 'sml12345'
    }
  },
  production: {
    client: 'postgres',
    connection: {
      ...props,
      ssl: { rejectUnauthorized: false }
    },
  }
}