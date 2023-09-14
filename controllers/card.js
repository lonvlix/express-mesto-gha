const card = require('../models/card');

module.exports.createcard = (req, res) => {
  const { name, about } = req.body;

  card.create({ name, about })
    // eslint-disable-next-line no-shadow
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// eslint-disable-next-line no-unused-vars
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
