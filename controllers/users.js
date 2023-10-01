const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SICRET_KEY } = require('../utils/constants');
const User = require('../models/user');

// Импорты констант статусов ответа сервера из файла
// constants.js и классовых ошибок из errors
const UnauthorizedError = require('../errors/Unauthorized');
const ConflictError = require('../errors/Conflict');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const { HTTP_CREATED_STATUS } = require('../utils/constants');

// Получение пользователей из базы данных mongodb
function getUsers(_, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

// Пользователь по id
function getUserById(req, res, next) {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

// Регистрация пользователя
function registration(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(HTTP_CREATED_STATUS).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(
            'Пользователь с данным электронным адресом уже зарегистрирован',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данные при регистрации пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Логин пользователя
function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, SICRET_KEY, {
          expiresIn: '7d',
        });
        return res.send({ _id: token });
      }
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
}

// Пользователь
function getUserInfo(req, res, next) {
  const { userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

// Редактирование профиля пользователя
function updateUser(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке обновления профиля',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Редактирование аватара пользователя
function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке обновления аватара',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  registration,
  login,
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateUserAvatar,
};
