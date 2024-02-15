const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const knex = require('../database/knex');

const authConfig = require('../configs/auth');
const AppError = require('../utils/AppError');

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex('users').where({ email }).first();

    if (!user) {
      throw new AppError('Email e/ou senha incorreto', 400);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Email e/ou senha incorreto', 400);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    const userTemplate = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      admin: user.is_admin,
    };

    return response.json({
      token,
      user: userTemplate,
    });
  }
}

module.exports = new SessionsController();
