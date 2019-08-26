/**
 * Module dependencies.
 */

const debug = require('./logger').debugger(__filename);

/**
 * Code mapping to response Status/Message/HTTP Code.
 */

const resCodes = {
  200: {
    httpStatus: 200,
    msg: {
      status: true,
      code: 200,
      message: 'Processed Successfully'
    }
  },
  201: {
    httpStatus: 201,
    msg: {
      status: true,
      code: 201,
      message: 'Created/Modified Successfully'
    }
  },
  202: {
    httpStatus: 202,
    msg: {
      status: true,
      code: 202,
      message: 'Deleted Successfully'
    }
  },
  400: {
    httpStatus: 400,
    msg: {
      status: false,
      code: 400,
      message: 'Incomplete/Bad Request'
    }
  },
  401: {
    httpStatus: 401,
    msg: {
      status: false,
      code: 401,
      message: 'Unauthorized Request'
    }
  },
  404: {
    httpStatus: 404,
    msg: {
      status: false,
      code: 404,
      message: 'Requested Resource Not Found'
    }
  },
  500: {
    httpStatus: 500,
    msg: {
      status: false,
      code: 500,
      message: 'Internal Server Error'
    }
  }
};

/**
 * Response creation function.
 */

module.exports = function (error, res, resCode, resData) {
  debug(error, resCode, resData);
  var response = resCodes[resCode];
  if (!response) {
    response = resCodes[500];
  }

  if (error) {
    response.msg.error = {};

    if (error.name) {
      response.msg.error.name = error.name;
    }

    if (error.message) {
      response.msg.error.message = error.message;
    }
  }

  if (resData) {
    response.msg.result = resData;
  }

  debug(response);
  res.status(response.httpStatus).send(response.msg);
};
