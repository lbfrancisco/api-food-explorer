const { hash, compare } = require('bcryptjs');

const AppError = require('../utils/AppError');

const knex = require('../database/knex');

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError('Por favor, todos os campos devem ser preenchidos.', 400);
    }

    const userExists = await knex('users').where({ email }).select('*').first();

    if (userExists) {
      throw new AppError('Email já cadastrado.', 400);
    }

    if (password.length < 6) {
      throw new AppError('A senha deve conter pelo menos 6 dígitos.', 400);
    }

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({ name, email, password: hashedPassword });

    return response.status(201).send('Usuário cadastrado com sucesso.');
  }

  async update(request, response) {
    const {
      name, email, password, oldPassword,
    } = request.body;

    const userId = request.user.id;

    if ((!password && !oldPassword) || (!password || !oldPassword)) {
      throw new AppError('Por favor, todos os campos devem ser preenchidos.', 400);
    }

    const user = await knex('users').select('*').where({ id: userId }).first();

    if (!user) {
      throw new AppError('Este usuário não foi encontrado.', 400);
    }

    if (email) {
      const emailExists = await knex('users').where({ email }).whereNot({ id: userId }).first();

      if (emailExists) {
        throw new AppError('Email já cadastrado.', 400);
      }
    }

    if (password && oldPassword) {
      const passwordMatch = await compare(oldPassword, user.password);

      if (!passwordMatch) {
        throw new AppError('A sua senha antiga não confere.', 400);
      }

      user.password = await hash(password, 8);
    }

    await knex('users').where({ id: userId }).update({
      name, email, password: user.password, updated_at: knex.fn.now(),
    });

    return response.json({
      name, email,
    });
  }
}

module.exports = new UsersController();
