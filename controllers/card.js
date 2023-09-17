/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
const card = require('../models/card');

module.exports.createcard = (req, res) => {
  const { name, about } = req.body;
  card.create({ name, about })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req) => card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
);

module.exports.dislikeCard = (req) => card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
);

module.exports.getCards = (req, res, next) => {
  card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(DEFAULT_SUCCESS_CODE).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const currentUserId = req.user._id
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      next(error);
    });
};