const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const router = express.Router();
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');

// 引用檔案 - 錯誤訊息
const appError = require('../servers/appError');
const handleErrorAsync = require('../servers/handleErrorAsync');
const { isAuth, generateSendJWT } = require('../servers/auth');
const User = require('../Models/usersModel');

const uploadContr = {
    uploadImg: handleErrorAsync(async (req, res, next) => {
        // 有沒有檔案
        if (!req.files.length) {
            return next(appError(400, '尚未上傳檔案', next));
        }
        // 有使用到image-size套件
        const dimensions = sizeOf(req.files[0].buffer);
        if (dimensions.width !== dimensions.height) {
            return next(appError(400, '圖片長寬不符合 1:1 尺寸。', next));
        }
        // imgur打包
        const client = new ImgurClient({
            clientId: process.env.IMGUR_CLIENTID,
            clientSecret: process.env.IMGUR_CLIENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN,
        });
        const response = await client.upload({
            image: req.files[0].buffer.toString('base64'),
            type: 'base64',
            album: process.env.IMGUR_ALBUM_ID,
        });
        res.status(200).json({
            status: 'success',
            imgUrl: response.data.link,
        });
    }),
};
module.exports = uploadContr;
