var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var expressValidator = require('express-validator');
var mongo = require('mongodb');
var db = require('monk')('localhost/blog');
var multer = require('multer');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*file uploads & multipart data
app.use(multer({dest:'./uploads/'})).single('photo');*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//express session
app.use(session({
secret: 'secret',
saveUninitialized: true,
resave: true
}));


app.use(express.static(path.join(__dirname, 'public')));

//connect-flash
app.use(flash());
app.use((req, res, next)=>{
res.locals.messages = require('express-messages')(req, res);
next();
});

//fazendo o database acessivel para o router
app.use((req, res, next)=>{
  req.db = db;
  next();
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
