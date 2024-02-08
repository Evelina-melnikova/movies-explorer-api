const HttpCodes = require('../constants/constants');

class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizateError';
    this.statusCode = HttpCodes.unAuthorizedError;
  }
}

module.exports = AuthorizedError;
