const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { AuthorizedError } = require('../utils/AuthorizedError');

const { NODE_ENV = 'production', JWT_SECRET = 'some-secret-key' } = process.env;
const parseCookie = cookieParser();

const auth = (req, res, next) => {
  module.exports = auth;
  parseCookie(req, res, () => {
    const { jwt: token } = req.cookies;
    if (!token) {
      next(new AuthorizedError('Необходима авторизация'));
    } else {
      let payload;
      try {
        payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      } catch (e) {
        next(new AuthorizedError('Неверный токен или истекло время действия'));
      }
      req.user = payload;
      next();
    }
  });
};
module.exports = auth;
