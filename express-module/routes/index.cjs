// routes/index.js
var express = require('express');
var router = express.Router();

// 개별 라우터 import
var homeRouter  = require('./home');
var usersRouter = require('./users');
var adminProductsRouter = require('./admin/products');

// 베이스 경로별로 하위 라우터 마운트
router.use('/', homeRouter);                     // /
router.use('/users', usersRouter);               // /users/...
router.use('/admin/products', adminProductsRouter); // /admin/products/...

module.exports = router;