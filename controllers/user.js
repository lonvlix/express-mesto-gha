/* eslint-disable no-sequences */
/* eslint-disable no-shadow */
const user = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about } = req.body;
  user.create({ name, about })
    // eslint-disable-next-line no-shadow
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.updateUser = (res, req, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  user.findByIdAndUpdate(id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => (req.params.userId, res, next);
module.exports.getMe = (req, res, next) => (req.user._id, res, next);
// eslint-disable-next-line no-undef
module.exports.updateUserAvatar = (req, res, next) => updateUser(req.user._id, req.body, res, next);
