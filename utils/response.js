/**
 * Module dependencies.
 */

const debug = require('./logger').debugger(__filename);

/**
 * Code mapping to response Status/Message/HTTP Code.
 */

const resCodes = {
  200: {
    status: true,
    code: 200,
    message: 'Processed Successfully'
  },
  201: {
    status: true,
    code: 201,
    message: 'Created/Modified Successfully'
  },
  400: {
    status: false,
    code: 400,
    message: 'Incomplete/Bad request'
  },
  401: {
    status: false,
    code: 401,
    message: 'Unauthorized request'
  },
  404: {
    status: false,
    code: 404,
    message: 'Requested resource not found'
  },
  500: {
    status: false,
    code: 500,
    message: 'Internal server error'
  }
};

/**
 * Response creation function.
 */

module.exports = function (error, code, data) {
  debug(error, code, data);
  var response = resCodes[code];
  if (!response) {
    response = resCodes[500];
  }

  if (error) {
    response.error = {};

    if (error.name) {
      response.error.name = error.name;
    }

    if (error.message) {
      response.error.message = error.message;
    }

    return response;
  }

  if (data) {
    response.result = data;
  }

  debug(response);
  return response;
};
