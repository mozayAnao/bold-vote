var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('config');
const mongoose = require('mongoose');

var app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

const environment = app.get('env');

let dbConnectionString = '';

if (environment === 'development') {
  dbConnectionString = config.get('dbConnectionString');
} else {
  dbConnectionString = config.get('dbConnectionString-Prod');
}

mongoose
  .connect(dbConnectionString)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const electionsRouter = require('./routes/election');
const positionsRouter = require('./routes/positions');
const aspirantsRouter = require('./routes/aspitants');
const votersRouter = require('./routes/voters');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/elections', electionsRouter);
app.use('/positions', positionsRouter);
app.use('/aspirants', aspirantsRouter);
app.use('/voters', votersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
