
exports.up = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('firstname').notNullable()
    table.string('lastname').notNullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.enu('role', ['user', 'admin']).defaultTo('user')
    table.enu('status', ['enabled', 'disabled']).defaultTo('disabled')
  })

  await knex.schema.createTable('coins', (table) => {
    table.increments('id')
    table.string('symbol')
    table.string('name')
    table.string('slug')
    table.integer('cmc_rank')
    table.decimal('price', 10, 2)
    table.decimal('volume24h', 18, 6)
    table.decimal('percent_change_1h', 10, 2)
    table.decimal('percent_change_24h', 10, 2)
    table.decimal('percent_change_7d', 10, 2)
    table.decimal('market_cap', 20, 2)
  })

  await knex.schema.createTable('portfolio', (table) => {
    table.increments('id')
    table.decimal('amount', 10, 2)
    table.integer('coinId').unsigned()
    table.integer('userId').unsigned()
    table.foreign('coinId').references('id').inTable('coins')
    table.foreign('userId').references('id').inTable('users')
  })

};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('portfolio')
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('coins')
};

