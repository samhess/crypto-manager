
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {firstname: 'Samuel', lastname: 'Hess', email: 'samhess78@gmail.com', password: 'sml1234', role: 'admin', status: 'enabled' }
      ]);
    });
};
