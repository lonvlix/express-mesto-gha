const Card = require('../models/card');

// Импорты констант статусов ответа сервера из файла constants.js
const {
  OK_STATUS,
  HTTP_CREATED_STATUS,
  HTTP_BAD_REQUEST_STATUS,
  NOT_FOUND_PAGE_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/constants');

// Получение массива карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_STATUS).send(cards))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({
      message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
    }));
};

// Создание новой карточки
module.exports.createcard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_CREATED_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST_STATUS).send({
          message:
            'При создании новой карточки были переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS).send({
          message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
        });
      }
    });
};

// Лайк карточки
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS)
          .send({ message: 'Карточка c передаваемым id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS).send({
          message:
            'При попытке поставить лайк на карточку переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Снятие лайка с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS).send({
          message:
            'При попытке снять лайк с карточки переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Удаление карточки из массива
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_PAGE_STATUS)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST_STATUS).send({
          message: 'При попытке удалить карточку переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS).send({
          message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
        });
      }
    });
};
