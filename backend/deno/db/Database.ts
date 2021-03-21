import { denodb } from '../deps.ts'
const { Database, MySQLConnector } = denodb

const connector = new MySQLConnector({
  host: 'localhost',
  username: 'deno',
  password: 'sml12345',
  database: 'crypto2'
})

const db = new Database({connector, debug: false})

export default db