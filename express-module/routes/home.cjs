// routes/home.js
var express = require('express');
var router = express.Router();
var homeCtrl = require('../controllers/home.controller');

// GET /
router.get('/', homeCtrl.index);

// GET /about
router.get('/about', homeCtrl.about);

module.exports = router;