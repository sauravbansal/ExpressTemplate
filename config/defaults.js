/**
 * Default configurations for all environments.
 */

module.exports = {
  logFormat: ':remote-addr [:date[clf]] - ":method :url HTTP/:http-version" :status :res[content-length] :response-time[digits]',
  api: {
    version: 'v1'
  },
  dbConfig: {
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
  }
};
