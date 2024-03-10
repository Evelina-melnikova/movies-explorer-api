const HttpCodes = require('../constants/constants');

class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizedError';
    this.statusCode = HttpCodes.unAuthorizedError;
  }
}

module.exports = AuthorizedError;
