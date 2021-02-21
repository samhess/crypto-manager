
exports.up = function(knex) {
  return knex.schema.createTable('portfolio', (table) => {
    table.increments('id')
    table.decimal('amount', 10, 2)
    table.integer('coinId').unsigned().references('coins.id')
    table.integer('userId').unsigned().references('users.id')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('portfolio')
}
