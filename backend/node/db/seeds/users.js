const bcrypt = require('bcryptjs')
let password = bcrypt.hashSync('pass')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').delete()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { firstname: '', lastname: '', username: 'demo', role: 'user', status: 'enabled', password },
        { firstname: '', lastname: '', username: 'admin', role: 'admin', status: 'enabled', password }
      ])
    })
}
