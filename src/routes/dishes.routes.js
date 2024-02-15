const multer = require('multer');
const { Router } = require('express');
const uploadConfig = require('../configs/upload');

const upload = multer(uploadConfig.MULTER);

const dishesController = require('../controllers/DishesController');
const dishImagePreviewController = require('../controllers/DishImagePreviewController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const dishesRoutes = Router();

dishesRoutes.get('/', ensureAuthenticated, dishesController.index);
dishesRoutes.get('/:id', ensureAuthenticated, dishesController.show);
dishesRoutes.post('/', ensureAuthenticated, upload.single('image'), dishesController.create);
dishesRoutes.put('/:id', ensureAuthenticated, dishesController.update);
dishesRoutes.delete('/:id', ensureAuthenticated, dishesController.delete);
dishesRoutes.patch('/:id', ensureAuthenticated, upload.single('image'), dishImagePreviewController.update);

module.exports = dishesRoutes;
