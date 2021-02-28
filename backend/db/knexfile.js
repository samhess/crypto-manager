let dburl = process.env.DATABASE_URL
let props = {} 
props.database = dburl.split('/').pop()
props.user = dburl.split('://')[1].split(':').shift()
props.password = dburl.split('@').shift().split(':').pop()
props.host = dburl.split('@')[1].split(':').shift()

// Update with your config settings.
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'cm',
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