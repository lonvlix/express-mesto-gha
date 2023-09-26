// eslint-disable-next-line import/no-unresolved
const jwt = require('jsonwebtoken');

const { SICRET_KEY } = require('../utils/constants');

const UnauthorizedError = require('../errors/Unauthorized');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, SICRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
};
