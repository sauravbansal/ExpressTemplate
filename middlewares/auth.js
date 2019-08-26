/**
 * Module dependencies.
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const response = require('../utils/response');
const config = require('../config');

/**
 * Module : JWT creation function
 */

exports.sendJWTToken = function (req, res, next) {
  const user = req.user ? req.user : {};
  const token = jwt.sign(user, getSecret());
  response(null, res, 200, { token: token });
};

/**
 * Module JWT verification function
 */

exports.isJWTAuthenticated = function (req, res, next) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getSecret()
  };

  const strategy = new JwtStrategy(opts, function (payload, done) {
    return done(null, {});
  });

  passport.use(strategy);
  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      response(err, res, 401);
    } else if (info) {
      response(info, res, 401);
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

/**
 * Local: Get Base64 encoded JWT token function
 */

const getSecret = function () {
  return new Buffer.from(config.jwtSecret, 'base64');
};
