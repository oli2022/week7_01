const express = require('express');

const router = express.Router();

// 引用 postContr.js檔案
const postContr = require('../controllers/postContr');

router.get('/posts', (req, res, next) => postContr.getAllPosts(req, res, next));
router.post('/post', (req, res, next) => postContr.createPost(req, res, next));
router.delete('/post/:id', (req, res, next) => postContr.deleteOne(req, res, next));
router.delete('/posts', (req, res, next) => postContr.deleteAll(req, res, next));
router.patch('/post/:id', (req, res, next) => postContr.updatePost(req, res, next));

module.exports = router;
