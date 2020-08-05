const express = require('express');
const router = express.Router();
const Statis = require('../controller/statis/index');

// 获取当天API请求次数
router.get('/apiCount', (req, res, next) => {
    new Statis(req, res, next).apiCount(req, res, next);
});

// 获取所有API请求次数
router.get('/apiAllCount', (req, res, next) => {
    new Statis(req, res, next).apiAllCount(req, res, next);
});

// 获取所有API请求信息
router.get('/allApiRecord', (req, res, next) => {
    new Statis(req, res, next).allApiRecord(req, res, next);
});

// 获取当天注册人数
router.get('/userCount', (req, res, next) => {
    new Statis(req, res, next).userCount(req, res, next);
});

// 获取当天注册管理员人数
router.get('/adminCount', (req, res, next) => {
    new Statis(req, res, next).adminCount(req, res, next);
});

// 获取当天订单数量
router.get('/orderCount', (req, res, next) => {
    new Statis(req, res, next).orderCount(req, res, next);
});

module.exports = router;
