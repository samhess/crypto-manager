import { denodb } from '../deps.ts'
const { Database, MySQLConnector } = denodb

const connector = new denodb.MySQLConnector({
  host: 'localhost',
  username: 'deno',
  password: 'sml12345',
  database: 'crypto2'
})

const db = new denodb.Database({connector, debug: false})

export default db