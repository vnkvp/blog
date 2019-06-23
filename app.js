var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('logger');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var mongo = require('mongodb');
var db = require('monk')('localhost/blog');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();