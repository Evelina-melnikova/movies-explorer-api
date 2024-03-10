const HttpCodes = require('../constants/constants');

module.exports = class ErrorsProject extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorsProject';
    this.statusCode = HttpCodes.notFoundError;
  }
};
