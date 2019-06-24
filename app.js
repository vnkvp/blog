var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var mongo = require('mongodb');
var db = require('monk')('localhost/blog');
var multer = require('multer');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//setup do view engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//file uploads & multipart data

app.use(multer({dest: './public/images/uploads'}));


//tirar comment quando adicionar favicon em /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//express session

app.use(session({
secret: 'secret',
saveUninitialized: true,
resave: true
}));

//express validator

app.use(expressValidator({
errorFormatter: (param, msg, value)=>{
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
    }
    return{
        param: formParam,
        msg: msg,
        value: value
    };
}
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

app.use('/', routes);
app.use('/users', users); 

//catch 404 e ir direto para o gerenciador de erros

app.use((req, res, next)=>{
var err = new Error('Not found');
err.status = 404;
next(err);
});


