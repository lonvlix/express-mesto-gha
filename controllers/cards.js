const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const AccessDeniedError = require('../errors/AccessDenied');
const { HTTP_CREATED_STATUS } = require('../utils/constants');

// Получение массива карточек
function getCards(_, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

// Создание новой карточки
function createcard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_CREATED_STATUS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данных, при попытке добавления новой карточки на страницу.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Лайк карточки
function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new NotFoundError('Карточка с данным ID не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке поставить лайк.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Снятие лайка с карточки
function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new NotFoundError('Карточка c передаваемым ID не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке удаления лайка с карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Удаление карточки из массива
function deleteCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;
  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка c передаваемым ID не найдена');
      }
      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new AccessDeniedError('Нет прав доступа');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Данная карточка была удалена');
      }
      res.send({ data: deletedCard });
    })
    .catch(next);
}

module.exports = {
  getCards,
  createcard,
  likeCard,
  dislikeCard,
  deleteCard,
};
