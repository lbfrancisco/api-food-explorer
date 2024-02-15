const knex = require('../database/knex');
const DiskStorage = require('../providers/DiskStorage');

class UserAvatarController {
  async update(request, response) {
    const { id } = request.params;
    const avatarFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex('users')
      .where({ id }).first();

    if (!user) return response.status(400).json({ message: 'Usuário não encontrado.' });

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const fileName = await diskStorage.saveFile(avatarFileName);
    user.avatar = fileName;

    await knex('users').update(user).where({ id });

    return response.json(user);
  }
}

module.exports = new UserAvatarController();
