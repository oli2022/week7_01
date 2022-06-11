const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const router = express.Router();

// 引用檔案 - 錯誤訊息
const appError = require('../servers/appError');
const handleErrorAsync = require('../servers/handleErrorAsync');
const { isAuth, generateSendJWT } = require('../servers/auth');
const User = require('../Models/usersModel');

const userControllers = {
    signUp: handleErrorAsync(async (req, res, next) => {
        let { email, password, confirmPassword, name } = req.body;
        // 內容不可為空
        if (!email || !password || !confirmPassword || !name) {
            return next(appError('400', '欄位未填寫正確！', next));
        }
        // 密碼正確
        if (password !== confirmPassword) {
            return next(appError('400', '密碼不一致！', next));
        }
        // 密碼 8 碼以上
        if (!validator.isLength(password, { min: 8 })) {
            return next(appError('400', '密碼字數低於 8 碼', next));
        }
        // 是否為 Email
        if (!validator.isEmail(email)) {
            return next(appError('400', 'Email 格式不正確', next));
        }

        // 加密密碼
        password = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            email,
            password,
            name,
        });
        generateSendJWT(newUser, 201, res);
    }),
    signIn: handleErrorAsync(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(appError(400, '帳號密碼不可為空', next));
        }

        const user = await User.findOne({ email }).select('+password');
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return next(appError(400, '您的密碼不正確', next));
        }

        generateSendJWT(user, 200, res);
    }),
    updatePassword: handleErrorAsync(async (req, res, next) => {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return next(appError('400', '密碼不一致！', next));
        }
        // 設定新密碼
        newPassword = await bcrypt.hash(password, 12);
        // 更新新密碼
        const user = await User.findByIdAndUpdate(req.user.id, {
            password: newPassword,
        });

        generateSendJWT(user, 200, res);
    }),
    profile: handleErrorAsync(async (req, res, next) => {
        res.status(200).json({
            status: '資料取得成功',
            user: req.user,
        });
    }),
    updateProfile: handleErrorAsync(async (req, res, next) => {
        const data = req.body;
        const newArray = Object.keys(data);

        if (newArray.includes('name') && !data.name) {
            return next(appError(400, '名字不為空', next));
        } else if (newArray.includes('email') && !data.email) {
            return next(appError(400, 'Email不為空', next));
        }

        // const resultUser = await User.findByIdAndUpdate(req.user.id, data);
        // if (resultUser == null) {
        //     return next(appError(400, '查無此id', next));
        // }
        const newData = await User.findById(req.user.id).select('+email'); // 可能改email所以顯示
        res.status(200).json({ status: '資料更新成功', data: newData });
    }),
};
module.exports = userControllers;
