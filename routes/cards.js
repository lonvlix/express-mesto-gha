const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_PATTERN } = require('../utils/constants');

const {
  getCards,
  createcard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Маршрут для получения карточек
router.get('/', getCards);

// Маршрут для новой карточки
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(URL_PATTERN),
    }),
  }),
  createcard,
);

// Маршрут удаления карточки
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

// Маршрут для лайка карточки
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

// Маршрут для удаления лайка с карточки
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
