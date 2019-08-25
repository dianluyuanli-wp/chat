var createError = require('http-errors');
var express = require('express');
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');

var app = express();
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'dist'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//  设置静态资源的位置，同时设置过期时间
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: String(24*60*60*1000*60)
}));

app.use('*.html', indexRouter);

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
