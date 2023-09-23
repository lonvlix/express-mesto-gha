const User = require('../models/user');

// Импорты констант статусов ответа сервера из файла constants.js
const {
  OK_STATUS,
  HTTP_CREATED_STATUS,
  HTTP_BAD_REQUEST_STATUS,
  NOT_FOUND_PAGE_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/constants');

// Получение пользователей из базы данных mongodb
module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({
      message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
    }));
};

// Пользователь по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS).send({
          message: 'При поиске пользователя были переданы некорректные данные',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS).send({
          message: 'Пользователь c указанным _id не найден',
        });
      }

      return res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_CREATED_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST_STATUS).send({
          message:
            'При создании пользователя были переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS).send({
          message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
        });
      }
    });
};

// Редактирование аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS).send({
          message: 'Данный пользователь не был найден',
        });
      }

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(HTTP_BAD_REQUEST_STATUS).send({
          message: 'При обновлении аватара были переданы некорректные данные',
          validationErrors,
        });
      }

      return res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Редактирование профиля пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS).send({
          message: 'Данный пользователь не найден',
        });
      }

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(HTTP_BAD_REQUEST_STATUS).send({
          message: 'При обновлении профиля были переданы некорректные данные',
          validationErrors,
        });
      }

      return res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};
