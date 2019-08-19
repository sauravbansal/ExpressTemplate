/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const response = require('../../utils/response');

/**
* @swagger
* /:
*   get:
*     tags:
*       - root
*     summary: Server verification api
*     security: []
*     responses:
*       200:
*         "$ref": '#/components/responses/200'
*       500:
*         "$ref": '#/components/responses/500'
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
