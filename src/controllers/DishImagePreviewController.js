const knex = require('../database/knex');
const AppError = require('../utils/AppError');

const DiskStorage = require('../providers/DiskStorage');

class DishImagePreviewController {
  async update(request, response) {
    try {
      const { id } = request.params;
      const dishFilename = request.file?.filename;

      if (!dishFilename) {
        return response.status(401).json({ message: 'Não há nenhuma imagem para fazer upload.' });
      }

      const diskStorage = new DiskStorage();

      const dish = await knex('dishes').where({ id }).first();

      if (!dish) {
        throw new AppError('Somente usuários autenticados e admin podem alterar a imagem do prato.', 401);
      }

      if (dish.image) {
        await diskStorage.deleteFile(dish.image);
      }

      const filename = await diskStorage.saveFile(dishFilename);
      dish.image = filename;

      await knex('dishes').update(dish).where({ id });
      return response.sendStatus(204);
    } catch (error) {
      return response.status(500).json({ error: 'Ocorreu um erro ao atualizar a imagem prato.' });
    }
  }
}

module.exports = new DishImagePreviewController();
