var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const logger = require('./util/logger');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Log every incoming request
app.use('/', function(req, res, next){
  switch(req.method){
    case 'GET':
      logger.info(`${req.method} - ${req.originalUrl}`);
      break;
    case 'POST':
    case 'PATCH':
    case 'PUT':
      logger.info(`${req.method} - ${req.originalUrl} : ${JSON.stringify(req.body)}`);
      break;
    case 'DELETE':
      logger.info(`${req.method} - ${req.originalUrl}`);
      break;
  }
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(function(err, req, res, next) {
    logger.error(JSON.stringify(err.stack));
    res.status(500).send({error: "Something wrong happened."});
  });

module.exports = app;
