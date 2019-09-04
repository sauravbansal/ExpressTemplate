/**
 * Module dependencies.
 */

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

/*
 * Gobal variables
 */

const app = express();
const routePath = `${__dirname}/routes`;
const config = require('./config');
const debug = require('./utils/logger').debugger(__filename);
const response = require('./utils/response');
const swaggerSpec = require('./utils/swagger');
const dbConnection = require('./models');

/*
 * Application middleware functions
 */

app.disable('x-powered-by');

app.use(logger(config.logFormat));
app.use(cors(config.corsOptions));

app.use(express.json({
  inflate: true,
  limit: '100kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
}));

app.use(express.static('public'));

app.use(express.urlencoded({
  extended: false,
  inflate: true,
  limit: '100kb',
  parameterLimit: 1000,
  type: 'application/x-www-form-urlencoded',
  verify: undefined
}));

app.use('/coverage', express.static('coverage', {
  index: 'index.html'
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
 * DB connection verfication.
 */

dbConnection.sequelize
  .authenticate()
  .then(() => {
    debug('Connection has been established successfully.');
  })
  .catch(err => {
    console.error(`Unable to connect to the database due to [${err.name} : ${err.message}]`);
    process.exit(1);
  });

/*
 * Import all routes that app supports.
 */

fs.readdirSync(routePath)
  .filter(function (file) {
    return (fs.lstatSync(`${routePath}/${file}`).isDirectory());
  })
  .forEach(function (dir) {
    fs.readdirSync(`${routePath}/${dir}`)
      .filter(function (file) {
        return (fs.lstatSync(`${routePath}/${dir}/${file}`).isFile() && file.slice(-3) === '.js');
      })
      .forEach(function (file) {
        app.use(`/${dir}`, require(`${routePath}/${dir}/`));
      });
  });

/*
 * Default routes if no version specified.
 */

try {
  fs.readdirSync(`${routePath}/${config.api.version}`)
    .filter(function (file) {
      return (fs.lstatSync(`${routePath}/${config.api.version}/${file}`).isFile() && file.slice(-3) === '.js');
    })
    .forEach(function (file) {
      app.use('/', require(`${routePath}/${config.api.version}/`));
    });
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('Default API Version not found');
  } else {
    console.error('Error reading default API Router');
  }
  process.exit(1);
};

/*
 * Application unavailable resource handling middleware.
 */

app.use(function (req, res, next) {
  if (res.headersSent) {
    return next();
  } else {
    var resObject = {
      protocol: req.protocol,
      hostname: req.hostname,
      method: req.method,
      url: req.originalUrl
    };

    response(null, res, 404, resObject);
  }
});

/*
 * Application error handling middleware.
 */

app.use(function (err, req, res, next) {
  debug(err);
  if (res.headersSent) {
    return next(err);
  } else {
    response(err, res, 500);
  }
});

module.exports = app;
