/**
 * Default configurations for all environments.
 */

var pName = require(process.env.PWD + '/package.json').name;

module.exports = {
  logFormat: ':remote-addr [:date[clf]] - ":method :url HTTP/:http-version" :status :res[content-length] :response-time[digits]',
  api: {
    version: 'v1'
  },
  jwtOptions: {
    secret: `${pName}-${process.env.NODE_ENV || 'development'}`,
    issuer: `${pName}`,
    expiresIn: 60000,
    ignoreExpiration: false
  },
  dbConfig: {
    port: 3306,
    dialect: 'mysql',
    logging: false
  },
  corsOptions: {
    origin: '*',
    methods: 'POST, GET, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
  }
};
