const knex = require('../database/knex');
const DiskStorage = require('../providers/DiskStorage');
const AppError = require('../utils/AppError');

class DishesController {
  async index(request, response) {
    try {
      const dishes = await knex.select(
        'dishes.id',
        'dishes.name',
        'dishes.price',
        'dishes.description',
        'dishes.image',
        'categories.name as category_name',
        knex.raw('GROUP_CONCAT(ingredients.name) as ingredients_list'),
      )
        .from('dishes')
        .innerJoin('categories', 'dishes.category_id', 'categories.id')
        .leftJoin('ingredients', 'dishes.id', 'ingredients.dish_id')
        .groupBy('dishes.id');

      return response.status(200).json({ dishes });
    } catch (error) {
      AppError('Erro ao listar todos os pratos', error);
      return response.status(500).json({ error: 'Ocorreu um erro ao listar todos os pratos.' });
    }
  }

  async show(request, response) {
    try {
      const { id } = request.params;

      const dishes = await knex.select(
        'dishes.id',
        'dishes.name',
        'dishes.price',
        'dishes.description',
        'dishes.image',
        'categories.name as category_name',
        knex.raw('GROUP_CONCAT(ingredients.name) as ingredients_list'),
      )
        .from('dishes')
        .where('dishes.id', id)
        .innerJoin('categories', 'dishes.category_id', 'categories.id')
        .leftJoin('ingredients', 'dishes.id', 'ingredients.dish_id')
        .groupBy('dishes.id');

      return response.status(200).json({ dishes });
    } catch (error) {
      AppError('Erro ao buscar um prato:', error);
      return response.status(500).json({ error: 'Ocorreu um erro ao listar esse prato.' });
    }
  }

  async create(request, response) {
    try {
      const {
        name, description, price, category_id: categoryId, ingredients,
      } = request.body;
      const imagePath = request.file?.filename;

      const category = await knex('categories').select('*').where({ id: categoryId }).first();

      if (!category) {
        return response.status(404).json({ error: 'Categoria não encontrada' });
      }

      const [dishId] = await knex('dishes').insert({
        name,
        description,
        price: price.replace('.', ','),
        category_id: categoryId,
        image: imagePath || '',
      });

      const ingredientsInsert = JSON.parse(ingredients).map((ingredient) => ({
        dish_id: dishId,
        name: ingredient.name,
      }));

      await knex('ingredients').insert(ingredientsInsert);

      const diskStorage = new DiskStorage();
      diskStorage.saveFile(imagePath);

      return response.status(201).json({
        name, description, price, categoryId, ingredients, imagePath,
      });
    } catch (error) {
      AppError('Erro ao criar o prato:', error);
      return response.status(500).json({ error: 'Ocorreu um erro ao ciar o prato.' });
    }
  }

  async update(request, response) {
    try {
      const {
        name, description, price, category_id: categoryId, ingredients,
      } = request.body;

      const { id } = request.params;

      const dish = await knex('dishes').where({ id }).first();

      if (!dish) {
        return response.status(404).json({ error: 'Esse prato não existe ou já foi deletado.' });
      }

      const category = await knex('categories').select('*').where({ id: categoryId }).first();

      if (!category) {
        return response.status(404).json({ error: 'Categoria não encontrada' });
      }

      await knex('dishes').where({ id }).update({
        name,
        description,
        price: price.replace('.', ','),
        category_id: categoryId,
      });

      await knex('ingredients').where({ dish_id: id }).del();

      const ingredientsInsert = ingredients.map((ingredient) => ({
        dish_id: id,
        name: ingredient.name,
      }));

      await knex('ingredients').insert(ingredientsInsert);

      return response.status(201).json({ message: 'Prato atualizado com sucesso!' });
    } catch (error) {
      return response.status(500).json({ error: 'Ocorreu um erro ao atualizar o prato.' });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex('dishes').where({ id }).delete();

    return response.sendStatus(204);
  }
}

module.exports = new DishesController();
