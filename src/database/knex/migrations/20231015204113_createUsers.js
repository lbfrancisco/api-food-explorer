exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.uuid('id').defaultTo(knex.fn.uuid());
  table.text('name').notNullable();
  table.text('email').notNullable().unique();
  table.text('password').notNullable();
  table.text('avatar').nullable();
  table.boolean('is_admin').defaultTo(false);
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('users');
