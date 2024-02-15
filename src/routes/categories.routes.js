const { Router } = require('express');

const categoriesController = require('../controllers/CategoriesController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const categoriesRouter = Router();

categoriesRouter.get('/', ensureAuthenticated, categoriesController.index);
categoriesRouter.post('/', ensureAuthenticated, categoriesController.create);

module.exports = categoriesRouter;
