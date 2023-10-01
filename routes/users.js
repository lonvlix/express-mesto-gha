const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_PATTERN } = require('../utils/constants');

const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

// Маршрут получения всех пользователей
router.get('/', getUsers);

// Маршрут получения всех юзера
router.get('/me', getUserInfo);

// Маршрут получения всех пользователей по его id
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

// Маршрут редактирования данных пользователя
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

// Маршрут редактирования аватара пользователя
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(URL_PATTERN),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
