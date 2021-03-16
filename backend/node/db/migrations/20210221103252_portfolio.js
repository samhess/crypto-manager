
exports.up = function(knex) {
  return knex.schema.createTable('portfolio', (table) => {
    table.increments('id')
    table.float('amount', 10, 2)
    table.integer('coinid').unsigned().references('coins.id')
    table.integer('userid').unsigned().references('users.id')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('portfolio')
}
