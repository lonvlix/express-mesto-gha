const user = require('express').Router();

// eslint-disable-next-line object-curly-newline
const { getUsers, getUser, getMe, updateUserName, updateUserAvatar } = require('../controllers/user');

user.get('/', getUsers);
user.get('/me', getMe);
user.get('/:userId', getUser);
user.patch('/me', updateUserName);
user.patch('/me/avatar', updateUserAvatar);

module.exports = user;
