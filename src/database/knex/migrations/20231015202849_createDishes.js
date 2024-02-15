exports.up = (knex) => knex.schema.createTable('dishes', (table) => {
  table.increments('id').primary();
  table.text('name').notNullable();
  table.text('description');
  table.text('image');
  table.decimal('price', 10, 2);
  table.text('category_id').references('id').inTable('categories');

  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('dishes');
