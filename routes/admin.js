const express = require("express");
const router = express.Router();
const Admin = require("../controller/admin/admin");
const {authAdmin} = require("../utils/common"); // 检查是否登录
const passport = require('passport');
const {verifyToken} = require('../controller/jwt/index');

// 管理员登录&&注册
router.post('/login', (req, res, next) => {
    new Admin(req, res, next).login(req, res, next);
});

// 添加拦截器 进行token过期处理和token校验
router.use(verifyToken, passport.authenticate("jwt", {session: false}), function (req, res, next) {
    next();
});

// 删除管理员用户
router.post('/delete', (req, res, next) => {
   new Admin(req, res, next).delete(req, res, next);
});

// 管理员退出登录
router.post('/signout', (req, res, next) => {
    new Admin(req, res, next).signOut(req, res, next);
});

// 获取所有的管理员用户
router.get('/getalladmin', async (req, res, next) => {
    new Admin(req, res, next).getAllAdmin(req, res, next);
});

// 获取管理员总数
router.get('/getAdminCount', (req, res, next) => {
    new Admin(req, res, next).getAdminCount(req, res, next);
});

// 获取当前管理员信息
router.get('/getadmininfo', (req, res, next) => {
    new Admin(req, res, next).getAdminInfo(req, res);
});

// 改变头像
router.post('/updateavatar', (req, res, next) => {
    new Admin(req, res, next).updateAvatar(req, res);
});
module.exports = router;
