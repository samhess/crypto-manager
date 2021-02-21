
exports.up = function(knex) {
  return knex.schema.createTable('coins', (table) => {
    table.integer('id').unsigned().primary()
    table.string('symbol').unique()
    table.string('name')
    table.string('slug')
    table.integer('ranking')
    table.decimal('price', 10, 2)
    table.decimal('volume24h', 18, 2)
    table.decimal('change1h', 10, 2)
    table.decimal('change24h', 10, 2)
    table.decimal('change7d', 10, 2)
    table.decimal('marketCap', 20, 2)
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('coins')
}
