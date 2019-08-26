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
  const options = {
    expiresIn: config.jwtOptions.expiresIn,
    issuer: config.jwtOptions.issuer
  };

  const user = req.user ? req.user : {};
  const token = jwt.sign(user, getSecret(), options);
  response(null, res, 200, { token: token });
};

/**
 * Module JWT verification function
 */

exports.isJWTAuthenticated = function (req, res, next) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getSecret(),
    issuer: config.jwtOptions.issuer,
    ignoreExpiration: config.jwtOptions.ignoreExpiration
  };

  const strategy = new JwtStrategy(opts, function (payload, done) {
    return done(null, {});
  });

  passport.use(strategy);
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
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
  return new Buffer.from(config.jwtOptions.secret, 'base64');
};
