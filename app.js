const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
const db = require('monk')('localhost/blog');
const multer = require('multer');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//storage engine
const storage = multer.diskStorage({
destination: './upload',
filename: (req, file, callback)=>{
  callback(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
}
});

// upload
const upload = multer({storage: storage}).single('post');

app.post('/upload', (req, res)=>{
upload(req, res, (err)=>{
if(err){
res.render('index', {
  msg: err
});
}else{
  console.log(req.file);
  res.send('test');
}
})

});

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
