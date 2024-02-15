const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const upload = multer(uploadConfig.MULTER);

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersControllers = require('../controllers/UsersController');
const userAvatarController = require('../controllers/UserAvatarController');

const usersRoutes = Router();

usersRoutes.post('/', usersControllers.create);
usersRoutes.put('/', ensureAuthenticated, usersControllers.update);
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update);

module.exports = usersRoutes;
