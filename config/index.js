/**
 * Module dependencies.
 */

const fs = require('fs');
const defaults = require('./defaults');

/**
 * Global variables.
 */

const confData = {};

/**
 * Read all configuration files that exists in env directory.
 */

fs.readdirSync(`${__dirname}/env`)
  .filter(function (file) {
    return (fs.lstatSync(`${__dirname}/env/${file}`).isFile() && file.slice(-3) === '.js');
  })
  .forEach(function (file) {
    var fileName = file.replace(file.slice(-3), '');
    confData[fileName] = Object.assign(defaults, require(`${__dirname}/env/${file}`));
  });

/**
 * Get running mode from environment or default to development.
 */

module.exports = confData[process.env.NODE_ENV || 'development'];
