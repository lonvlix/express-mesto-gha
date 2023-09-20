const router = require('express').Router();

const {
  getCards,
  createcard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Маршрут всех карточек:
router.get('/', getCards);
// Маршрут для новой карточки:
router.post('/', createcard);
// Маршрут для удаления карточки:
router.delete('/:cardId', deleteCard);
// Маршрут для постановки лайка на карточку:
router.put('/:cardId/likes', likeCard);
// Маршрут для снятия лайка с карточки:
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
