'use strict';

var util = require('util');

function ModelValidationError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ModelValidationError';
  this.message = message;
}

util.inherits(ModelValidationError, Error);

module.exports = ModelValidationError;
