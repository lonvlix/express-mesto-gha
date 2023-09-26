// eslint-disable-next-line import/no-unresolved
const rateLimiter = require('express-rate-limit');

// Ограничитель запросов
const limiter = rateLimiter({
// Максимальное количество запросов
  max: 100,
  // Продолжительность периода в миллисекундах
  windowMS: 60000,
  // Сообщение, отправляемое при превышении лимита запросов
  message: 'Превышено количество запросов на сервер. Попробуйте повторить немного позже',
});

module.exports = limiter;
