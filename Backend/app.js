var createError = require('http-errors');
var express = require('express');
const session = require("express-session")
var path = require('path');
const bodyParser = require("body-parser")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const User = require("./models/user")
require('./mongoConfig')
require("./api/Strategies/LocalStrategy")
require("./api/Strategies/JWTStrategy")
require('./authorization')


var indexRouter = require('./v1/routes/index');
var usersRouter = require('./v1/routes/users');
let topicsRouter = require('./v1/routes/topics')
let postsRouter = require('./v1/routes/posts')
let apiTopicsRouter = require('./api/Routes/api_topics')
let apiUserRouter = require('./api/Routes/api_users')
let apiPostRouter = require('./api/Routes/api_posts')
let apiCommentRouter = require('./api/Routes/api_comments')
let apiSearch = require('./api/Routes/api_search')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//USE STATMENTS

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/t', topicsRouter)
app.use('/posts', postsRouter)
app.use('/api/topics', apiTopicsRouter)
app.use('/api/user', apiUserRouter)
app.use('/api/posts', apiPostRouter)
app.use('/api/comments', apiCommentRouter)
app.use('/api/search', apiSearch)

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

module.exports = app;
