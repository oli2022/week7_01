var express = require('express');
var router = express.Router();
const { isAuth } = require('../servers/auth');
const upload = require('../servers/image');

// 引進 uploadContr.js
const uploadContr = require('../controllers/uploadContr');

router.post('/', isAuth, upload, uploadContr.uploadImg);

module.exports = router;
