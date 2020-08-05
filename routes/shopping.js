const express = require("express");
const router = express.Router();

const Shop = require('../controller/shopping/shop');
const Food = require('../controller/shopping/food');
const Category = require('../controller/shopping/category');

// 添加商铺
router.post('/addShop', (req, res, next) => {
   new Shop(req, res, next).addShop(req, res, next);
});

// 获取餐馆列表
router.get('/getRestaurants', (req, res, next) => {
    new Shop(req, res, next).getRestaurants(req, res, next);
});

// 搜索餐馆
router.get('/searchRestaurant', (req, res, next) => {
    new Shop(req, res, next).searchRestaurant(req, res, next);
});

// 获取餐馆详情
router.get('/getRestaurantDetail', (req, res, next) => {
    new Shop(req, res, next).getRestaurantDetail(req, res, next);
});

// 获取餐馆总数
router.get('/getShopCount', (req, res, next) => {
    new Shop(req, res, next).getShopCount(req, res, next);
});

// 修改商铺信息
router.post('/updateShop', (req, res, next) => {
    new Shop(req, res, next).updateShop(req, res, next);
});

// 删除餐馆
router.get('/deleteRestaurant', (req, res, next) => {
    new Shop(req, res, next).deleteRestaurant(req, res, next);
});


// 初始化
router.get('/initData', (req, res, next) => {
    new Food(req, res, next).initData(req, res, next);
});

// 获取餐馆食品种类
router.get('/getCategory', (req, res, next) => {
    new Food(req, res, next).getCategory(req, res, next);
});

// 添加食品种类
router.post('/addCategory', (req, res, next) => {
    new Food(req, res, next).addCategory(req, res, next);
});

// 添加食品
router.post('/addFood', (req, res, next) => {
    new Food(req, res, next).addFood(req, res, next);
});

// 获取菜单
router.get('/getMenu', (req, res, next) => {
    new Food(req, res, next).getMenu(req, res, next);
});

// 获取Menu详情
router.get('/getMenuDetail', (req, res, next) => {
    new Food(req, res, next).getMenuDetail(req, res, next);
});

// 获取食品数据
router.get('/getFoods', (req, res, next) => {
    new Food(req, res, next).getFoods(req, res, next);
});

// 获取食品数量
router.get('/getFoodsCount', (req, res, next) => {
    new Food(req, res, next).getFoodsCount(req, res, next);
});

// 更新食品信息
router.post('/updateFood', (req, res, next) => {
    new Food(req, res, next).updateFood(req, res, next);
});

// 删除食品
router.post('/deleteFood', (req, res, next) => {
    new Food(req, res, next).deleteFood(req, res, next);
});


// 获取所有餐馆分类和数量
router.get('/getCategories', (req, res, next) => {
    new Category(req, res, next).getCategories(req, res, next);
});

// 增加category数量
router.post('/addCategory', (req, res, next) => {
    new Category(req, res, next).addCategory(req, res, next);
});

// 获取配送方式
router.get('/getDelivery', (req, res, next) => {
    new Category(req, res, next).getDelivery(req, res, next);
});

// 获取活动列表
router.get('/getActivity', (req, res, next) => {
    new Category(req, res, next).getActivity(req, res, next);
});

module.exports = router;
