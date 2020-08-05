const express = require('express');
const router = express.Router();
const User = require('../controller/v2/user');

// 用户登录
router.post('/login', (req, res, next) => {
    new User(req, res, next).login(req, res, next);
});

// 查找当前用户信息
router.get('/getUserInfo', (req, res, next) => {
    new User(req, res, next).getUserInfo(req, res, next);
});

// 根据id查找用户信息
router.get('/getUserById', (req, res, next) => {
    new User(req, res, next).getUserById(req, res, next);
});

// 退出登录
router.post('/signOut', (req, res, next) => {
    new User(req, res, next).signOut(req, res, next);
});

// 更改密码
router.post('/changePassword', (req, res, next) => {
    new User(req, res, next).changePassword(req, res, next);
});

// 获取用户列表数据
router.get('/getUserList', (req, res, next) => {
    new User(req, res, next).getUserList(req, res, next);
});

// 获取用户总数
router.get('/getUserCount', (req, res, next) => {
    new User(req, res, next).getUserCount(req, res, next);
});

// 更新用户头像
router.post('/updateAvatar', (req, res, next) => {
    new User(req, res, next).updateAvatar(req, res, next);
});

// 获取用户城市
router.get('/getUserCity', (req, res, next) => {
    new User(req, res, next).getUserCity(req, res, next);
});

module.exports = router;
