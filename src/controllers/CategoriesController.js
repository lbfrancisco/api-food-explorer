const knex = require('../database/knex');

class DishesController {
  async index(request, response) {
    const categories = await knex('categories').select('*');

    return response.status(200).json({ categories });
  }

  async create(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(401).json({ error: 'O nome da categoria é obrigatório.' });
    }

    const categoryExists = await knex('categories').select('*').where({ name }).first();

    if (categoryExists) {
      return response.status(401).json({ error: 'Essa categoria já existe.' });
    }

    const category = await knex('categories').insert({ name });

    return response.status(201).json({ category, name });
  }
}

module.exports = new DishesController();
