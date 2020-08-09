
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('portfolio').del()
    .then(function () {
      // Inserts seed entries
      /*
      return knex('portfolio').insert([
        {amount: 1, coinId: 1, userId: 1},
      ]);
      */
    });
};
