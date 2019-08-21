'use strict';

/**
 * Module dependencies.
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(path.join(__dirname, '/../config'));

/**
 * Global variables.
 */

const db = { Sequelize: Sequelize };

/**
 * Read DB configuration details and initilize Sequelize object.
 */

const sequelize = new Sequelize(config.db.database,
  config.db.username,
  config.db.password,
  {
    ...config.dbConfig,
    ...config.db.dbConfig
  });

/**
 * Import DB Model from model files.
 */

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

module.exports = db;
