const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Content 未填寫'],
        },
        image: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user', // 來源為collections裡的user資料
            required: [true, '貼文 id 未填寫'],
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        versionKey: false,
    }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;