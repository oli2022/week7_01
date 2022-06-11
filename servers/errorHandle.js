const errorHandle = (res, err) => {
    res.status(400).json({
        status: '結果：失敗',
        message: '欄位沒有正確',
        err,
    });
};

const deleteError = (res, err) => {
    res.status(400).json({
        status: '結果：失敗',
        message: '無此 id',
        err,
    });
};

const deleteAllError = (res, err) => {
    res.status(400).json({
        status: '結果：失敗',
        message: '網址錯誤',
        err,
    });
};

// 帳密空白
const nullError = (res, err) => {
    res.status(400).json({
        status: '結果：輸入無效文字',
        message: 'name、content 不可為空白',
        err,
    });
};

module.exports = { errorHandle, deleteError, deleteAllError, nullError };
