const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { AuthorizedError } = require('../utils/AuthorizedError');

const { NODE_ENV = 'production', JWT_SECRET = 'some-secret-key' } = process.env;

const parseCookie = cookieParser();

const auth = (req, res, next) => {
  parseCookie(req, res, (err) => {
    if (err) {
      return next(new AuthorizedError('Ошибка разбора куки'));
    }

    const { jwt: token } = req.cookies;

    if (!token) {
      return next(new AuthorizedError('Необходима авторизация'));
    }

    try {
      const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      req.user = payload;
      return next();
    } catch (error) {
      return next(new AuthorizedError({ message: error.message }));
    }
  });
};

module.exports = auth;
