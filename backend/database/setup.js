const dotenv = require('dotenv');
var cwd = process.cwd().split('\\').reverse()[0]
envFilePath = (cwd === 'database') ? '../.env' : '.env'
dotenv.config({path:envFilePath});
const rootPassword = process.env.DATABASE_ROOTPASSWORD
const dbtype = process.env.DATABASE_TYPE
const dbname = process.env.DATABASE_NAME
const techUser = process.env.DATABASE_USER
const password = process.env.DATABASE_PASSWORD
const knex = require('knex')(`mysql://root:${rootPassword}@localhost:3306/`)

function executeSQL(command) {
  return knex.raw(command).then((res) => {
    console.log('OK: ' + command)
  }).catch((err) => {
    console.log('ERROR: ' + err.sql)
    console.log(' ' + err.sqlMessage)
  })
}

async function createDatabase() {
  // create database imanager
  if (dbname !== 'sys') {
    await executeSQL(`DROP DATABASE IF EXISTS ${dbname};`)
    await executeSQL(`CREATE DATABASE ${dbname};`)
  }
  // create technical user knex
  if (techUser !== 'root') {
    await executeSQL(`DROP USER IF EXISTS '${techUser}'@'localhost';`)
    const mysqlNative = (dbtype === 'mysql') ? "WITH 'mysql_native_password'" : ''
    await executeSQL(`CREATE USER '${techUser}'@'localhost' IDENTIFIED ${mysqlNative} BY '${password}';`)
    await executeSQL(`GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, REFERENCES ON ${dbname}.* TO '${techUser}'@'localhost';`)
    await executeSQL('FLUSH PRIVILEGES;')
  } else {
    console.log('Do not use root as technical user!')
  }
  knex.destroy()
}

createDatabase()
