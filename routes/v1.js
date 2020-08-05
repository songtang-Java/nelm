const express = require('express');
const router = express.Router();

const CityHandle = require('../controller/v1/cities');
const Address = require('../controller/v1/address');
const Captcha = require('../controller/v1/captcha');
const SearchPlace = require('../controller/v1/search');
const Carts = require('../controller/v1/cart');
const Remark = require('../controller/v1/remark');
const Base = require('../utils/baseConfig');
const Order = require('../controller/v1/order');
const RedPaper = require('../controller/promotion/redPaper');

// 获取城市列表
router.get('/cities', (req, res, next) => {
    new CityHandle(req, res, next).getCity(req, res, next);
});
// 搜索地址
router.get('/position', (req, res, next) => {
    new SearchPlace(req, res, next).search(req, res, next);
});
// 获取所选城市信息
router.get('/cities/:id', (req, res, next) => {
    new CityHandle(req, res, next).getCityById(req, res, next);
});
// 获取具体位置
router.get('/detailAddress', (req, res, next) => {
    new CityHandle(req, res, next).getDetailAddress(req, res, next);
});

// 获取收获地址信息
router.get('/users/:user_id/getaddress', (req, res, next) => {
    new Address(req, res, next).getAddress(req, res, next);
});
// 增加收获地址信息
router.post('/users/:user_id/increaseaddress', (req, res, next) => {
    new Address(req, res, next).addAddress(req, res, next);
});

// 删除地址信息
router.post('/users/deleteaddress', (req, res, next) => {
    new Address(req, res, next).deleteAddress(req, res, next);
});

// 根据id查询收获地址信息
router.get('/users/getaddressbyid', (req, res, next) => {
    new Address(req, res, next).getAddressById(req, res, next);
});

// 获取验证码
router.get('/captcha', (req, res, next) => {
    new Captcha(req, res, next).getCaptcha(req, res, next);
});

// 加入购物车
router.post('/checkout', (req, res, next) => {
    new Carts(req, res, next).checkout(req, res, next);
});

// 获取备注数据
router.get('/checkout', (req, res, next) => {
    new Remark(req, res, next).getRemarks(req, res, next);
});

// 上传图片
router.post('/uploadImg', (req, res, next) => {
    new Base(req, res, next).uploadImg(req, res, next);
});

// --------------Order----------------- 下单
router.post('/postOrder', (req, res, next) => {
    new Order(req, res, next).postOrder(req, res, next);
});

// 获取当前用户所有订单
router.get('/getOrders', (req, res, next) => {
    new Order(req, res, next).getOrders(req, res, next);
});

// 获取订单详情
router.get('/getDetail', (req, res, next) => {
    new Order(req, res, next).getDetail(req, res, next);
});

// 获取订单总数
router.get('/getOrdersCount', (req, res, next) => {
    new Order(req, res, next).getOrdersCount(req, res, next);
});

// 获取所有订单列表
router.get('/getAllOrders', (req, res, next) => {
    new Order(req, res, next).getAllOrders(req, res, next);
});

// 无效的兑换码 红包
router.post('/exchange', (req, res, next) => {
    new RedPaper(req, res, next).exchange(req, res, next);
});

module.exports = router;
