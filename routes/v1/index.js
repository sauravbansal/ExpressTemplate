/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const response = require('../../utils/response');
const auth = require('../../middlewares/auth');

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

  response(null, res, 200, resObject);
});

/**
* @swagger
* /:
*   post:
*     tags:
*       - root
*     summary: Login Api for customer/enterprise-user
*     security: []
*     responses:
*       200:
*         "$ref": '#/components/responses/200'
*       401:
*         "$ref": '#/components/responses/401'
*       500:
*         "$ref": '#/components/responses/500'
*/

router.post('/login', auth.sendJWTToken);

module.exports = router;
