/**
 * Module dependencies.
 */

const express = require('express');
const logger = require('morgan');
const fs = require('fs');

/* 
 * Gobal variables
 */

const app = express();
const routePath = `${__dirname}/routes`;
const config = require('./config');
const debug = require('./utils/logger').debugger(__filename);
const response = require('./utils/response');

/* 
 * Application middleware functions
 */

app.disable('x-powered-by');

app.use(logger(config.logFormat));

app.use(express.json({
    inflate: true,
    limit: "100kb",
    reviver: null,
    strict: true,
    type: "application/json",
    verify: undefined
}));

app.use(express.static('public', {
    dotfiles: 'ignore',
    etag: true,
    extensions: false,
    fallthrough: true,
    immutable: false,
    index: 'index.html',
    lastModified: true,
    maxAge: 0,
    redirect: true,
    setHeaders: function (res, path, stat) { }
}));

app.use(express.urlencoded({
    extended: false,
    inflate: true,
    limit: "100kb",
    parameterLimit: 1000,
    type: "application/x-www-form-urlencoded",
    verify: undefined
}));

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
                var routeName = file.replace(file.slice(-3), '');
                if (routeName === 'index') {
                    app.use(`/${dir}`, require(`${routePath}/${dir}/${file}`));
                } else {
                    app.use(`/${dir}/${routeName}`, require(`${routePath}/${dir}/${file}`));
                }
            });
    });

/* 
 * Import default version routes that app supports. 
 */

fs.readdirSync(`${routePath}/${config.api.version}`)
    .filter(function (file) {
        return (fs.lstatSync(`${routePath}/${config.api.version}/${file}`).isFile() && file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var routeName = file.replace(file.slice(-3), '');
        if (routeName === 'index') {
            app.use(`/`, require(`${routePath}/${config.api.version}/${file}`));
        } else {
            app.use(`/${routeName}`, require(`${routePath}/${config.api.version}/${file}`));
        }
    });

/* 
 * Application error handling middleware. 
 */

app.use(function (req, res, next) {
    if (res.headersSent) {
        return next(err);
    } else {
        var resObject = {
            protocol: req.protocol,
            hostname: req.hostname,
            method: req.method,
            url: req.originalUrl
        };

        res.status(404).send(response(null, 404, resObject));
    }
});

/* 
 * Application error handling middleware. 
 */

app.use(function (err, req, res, next) {
    debug(err);
    if (res.headersSent)
        return next(err);
    else
        res.status(500).send(err.stack);
});

module.exports = app;
