/**
 * Module dependencies.
 */

const debug = require('./logger').debugger(__filename);
const lodash = require('lodash');
const constants = require(`${__dirname}/../constants/response-codes`);
/**
 * Code mapping to response Status/Message/HTTP Code.
 */

const resCodes = {
  /* to be used for successful get requests */
  200: {
    httpStatus: 200,
    body: {
      code: 'SUCCESS'
    }
  },
  /* to be used for bad request or missing parameters in the request */
  400: {
    httpStatus: 400,
    body: {
      code: 'BAD_REQUEST'
    }
  },
  /* Not to be used in api response - system default use */
  401: {
    httpStatus: 401,
    body: {
      code: 'UNAUTHORIZED'
    }
  },
  /* Not to be used in api response - system default use */
  404: {
    httpStatus: 404,
    body: {
      code: 'NOT_FOUND'
    }
  },
  /* Not to be used in api response - system default uses */
  500: {
    httpStatus: 500,
    body: {
      code: 'SERVER_ERROR'
    }
  }
};

/**
 * Response creation function.
 */

module.exports = function (err, res, resCode, resData) {
  debug(err, resCode, resData);
  let response = {};
  if (resCodes[resCode] !== undefined && !err) {
    response = JSON.parse(JSON.stringify(resCodes[resCode]));
  } else {
    response = JSON.parse(JSON.stringify(resCodes[500]));
  }

  if (err) {
    response.body.error = {};

    if (err.name) {
      response.body.error.name = err.name;
    }

    if (err.message) {
      response.body.error.message = err.message;
    }
  }

  if (resData) {
    if (typeof resData === 'string') {
      response.body.code = resData;
    } else {
      if (resData.code !== undefined) {
        response.body.code = resData.code;
        delete resData.code;
      }

      if (!lodash.isEmpty(resData)) {
        response.body.data = resData;
      }
    }

    if (resData.code !== undefined && !constants[response.body.code]) {
      response.body.code = 'CODE_NOT_FOUND';
    }
  }

  debug(response);
  res.status(response.httpStatus).send(response.body);
};
