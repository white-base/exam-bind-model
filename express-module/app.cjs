// app.js
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routes = require('./routes'); // routes/index.js

var app = express();

// 뷰 엔진 설정 (EJS 예시)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 공통 미들웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 마운트(모든 feature 라우터는 routes/index.js에서 일괄 관리)
app.use('/', routes);

// 404 처리
app.use(function(req, res, next) {
  res.status(404);
  res.render('home/404'); // 없으면 res.send('Not Found');
});

// 500 처리
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('home/500', { error: err });
});

module.exports = app;