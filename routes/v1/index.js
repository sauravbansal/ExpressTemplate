/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const response = require('../../utils/response');

/**
 * Version - V1 route file
 */

router.all('/', function (req, res, next) {
  var resObject = {
    protocol: req.protocol,
    hostname: req.hostname,
    method: req.method
  };

  res.send(response(null, 200, resObject));
});

module.exports = router;
