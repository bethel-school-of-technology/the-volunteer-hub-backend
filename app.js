var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();







var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var enableCors = function(req, res) {
    if (req.headers['access-control-request-method']) {
      res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
    }
  
    if (req.headers['access-control-request-headers']) {
      res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
    }
  
    if (req.headers.origin) {
      res.setHeader('access-control-allow-origin', req.headers.origin);
      res.setHeader('access-control-allow-credentials', 'true');
    }
  };
  

//CORS code 
 app.use(function(req, res, next) {
    enableCors(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', '*');
  // res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');

  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//CONNECTION TO MONGODB
 const mongoURI = process.env.MONGO_CONNECTION;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }),
(database) => {
  db = database.db('volunteer_hub')
};

mongoose.connection.on('connected', () => {
  console.log("DB connected!");
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

mongoose.connection.on('disconnected', () => {
  console.log("Db is DISCONNECTED!");
}); 

mongoose.set('useCreateIndex', true);


module.exports = app;
