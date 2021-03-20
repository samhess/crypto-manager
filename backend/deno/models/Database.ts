import { Database, MySQLConnector } from 'https://deno.land/x/denodb/mod.ts'

const connector = new MySQLConnector({
  host: 'localhost',
  username: 'deno',
  password: 'sml12345',
  database: 'crypto'
})

const db = new Database({connector, debug: false})

export default db