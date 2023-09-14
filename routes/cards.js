const card = require('express').Router();

// eslint-disable-next-line object-curly-newline
const { getCards, deleteCard, createCard, likeCard, dislikeCard } = require('../controllers/card');

card.get('/', getCards);
card.post('/', createCard);
card.delete('/:cardId', deleteCard);
card.put('/:cardId/likes', likeCard);
card.delete('/:cardId/likes', dislikeCard);

module.exports = card;
