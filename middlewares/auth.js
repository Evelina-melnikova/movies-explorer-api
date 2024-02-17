const jwt = require('jsonwebtoken');
const { AuthorizedError } = require('../utils/AuthorizedError');

const { NODE_ENV = 'production', JWT_SECRET = 'some-secret-key' } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (error) {
    next(new AuthorizedError('Неверный токен или истекло время действия'));
  }
};

module.exports = auth;
