// routes/admin/products.js
var express = require('express');
var router = express.Router();
var productsCtrl = require('../../controllers/products.controller.cjs');

// 목록
router.get('/', productsCtrl.list);

// 등록 폼
router.get('/new', productsCtrl.form);

// 등록 처리
router.post('/', productsCtrl.create);

module.exports = router;