
exports.up = function(knex) {
  return knex.schema.createTable('coins', (table) => {
    table.integer('id').unsigned().primary()
    table.string('symbol').unique()
    table.string('name')
    table.string('slug')
    table.integer('ranking')
    table.float('price', 10, 2)
    table.float('change1h', 10, 2)
    table.float('change24h', 10, 2)
    table.float('change7d', 10, 2)
    table.float('volume24h', 20, 2)
    table.float('marketcap', 20, 2)
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('coins')
}
