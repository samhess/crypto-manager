
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('firstname')
    table.string('lastname')
    table.string('username').notNullable().unique()
    table.string('password').notNullable()
    table.enu('role', ['user', 'admin']).defaultTo('user')
    table.enu('status', ['enabled', 'disabled']).defaultTo('disabled')
    })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
}
