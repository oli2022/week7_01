const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // 路徑

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB)
    .then(() => console.log('連線資料成功'))
    .catch((err) => console.log(err));
