var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');

var app = express();

// 程式出現重大錯誤時
process.on('uncaughtException', (err) => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('Uncaughted Exception！');
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
});
dotenv.config({ path: './config.env' });

// mongoose.connect('mongodb://localhost:27017/week7_01').then((res) => {
//     console.log('連線資料成功');
// });
// 連線資料庫
require('./connections/post');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(postsRouter);
app.use('/uploadImg', uploadRouter);

// 404 錯誤
app.use(function (req, res, next) {
    res.status(404).json({
        status: 'error',
        message: '路徑錯誤，請通知服務人員',
    });
});

// express 錯誤處理
// 自己設定的 err 錯誤
const resErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    } else {
        // log 紀錄
        console.error('出現重大錯誤', err);
        // 送出罐頭預設訊息
        res.status(500).json({
            status: 'error',
            message: '系統錯誤，請恰系統管理員',
        });
    }
};

// 開發環境錯誤
const resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        error: err,
        stack: err.stack, //會顯示出程式錯誤路徑
    });
};
// 錯誤處理
app.use(function (err, req, res, next) {
    // dev
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'dev') {
        return resErrorDev(err, res);
    }

    // production
    if (err.name === 'ValidationError') {
        err.message = 'user ID 未正確帶入';
        err.isOperational = true;
        return resErrorProd(err, res);
    }
    if (err.name === 'CastError') {
        err.message = '無此 Post ID 請重新確認!';
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
    }
    if (err.name === 'SyntaxError') {
        err.message = '格式錯誤, 請重新確認!';
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
    }
    resErrorProd(err, res);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
