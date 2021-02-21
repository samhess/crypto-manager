exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {firstname: 'Samuel', lastname: 'Hess', username: 'samhess78@gmail.com', password: 'sml12345', role: 'admin', status: 'enabled' }
      ]);
    });
};
