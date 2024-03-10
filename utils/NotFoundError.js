const HttpCodes = require('../constants/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = HttpCodes.notFoundError;
  }
}

module.exports = NotFoundError;
