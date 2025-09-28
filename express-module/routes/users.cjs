// routes/users.js
var express = require('express');
var router = express.Router();
var usersCtrl = require('../controllers/users.controller.cjs');

// 사용자 목록
router.get('/', usersCtrl.list);

// 상세
router.get('/:id', validateId, usersCtrl.detail);

// 공통 파라미터 검증(간단 예시)
function validateId(req, res, next) {
  var id = req.params.id;
  if (!/^\d+$/.test(id)) return res.status(400).send('Invalid id');
  next();
}

module.exports = router;