var express = require('express');
var router = express.Router();
const { isAuth } = require('../servers/auth');
// 引用 userContr.js
const userContr = require('../controllers/userContr');

router.post('/sign_up', (req, res, next) => userContr.signUp(req, res, next)); // 註冊
router.post('/sign_in', (req, res, next) => userContr.signIn(req, res, next)); // 登入
router.post('/updatePassword', isAuth, (req, res, next) => userContr.updatePassword(req, res, next)); // 密碼更新
router.get('/profile', isAuth, (req, res, next) => userContr.profile(req, res, next)); // 取得個人資料
router.patch('/updateProfile', isAuth, (req, res, next) => userContr.updateProfile(req, res, next)); // 取得個人資料

module.exports = router;
