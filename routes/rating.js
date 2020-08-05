const express = require('express');
const router = express.Router();
const Rating = require('../controller/rating/index');

router.get('/initData', (req, res, next) => {
   new Rating(req, res, next).initData(req, res, next);
});

// 获取评论列表
router.get('/getRating', (req, res, next) => {
    new Rating(req, res, next).getRating(req, res, next);
});

// 获取评论分数
router.get('/getScores', (req, res, next) => {
    new Rating(req, res, next).getScores(req, res, next);
});

// 获取评论标签
router.get('/getTags', (req, res, next) => {
    new Rating(req, res, next).getTags(req, res, next);
});

module.exports = router;
