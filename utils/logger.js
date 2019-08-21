/**
 * Module dependencies.
 */

const debug = require('debug');
const path = require('path');

/**
 * Global variables.
 */

const pwd = process.env.PWD;
const pName = require(pwd + '/package.json').name;

/**
 * Debugger function.
 */

module.exports.debugger = function (fileName) {
  const filePath = fileName.substring(
    pwd.length, fileName.lastIndexOf('.'));
  const ns = filePath.replace(new RegExp('\\' + path.sep, 'g'), ':');
  return debug(`${pName}${ns}`);
};
