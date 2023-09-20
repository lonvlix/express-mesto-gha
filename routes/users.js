const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUserAvatar,
  updateUser,
} = require('../controllers/users');

// Все пользователи
router.get('/', getUsers);
// Конкретный пользователь по его id
router.get('/:userId', getUserById);
// Создание нового пользователя
router.post('/', createUser);
// Редактирование аватара пользователя
router.patch('/me/avatar', updateUserAvatar);
// Редактирование данных о пользователе:
router.patch('/me', updateUser);

module.exports = router;
