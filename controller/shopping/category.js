const CategoryModel = require('../../database/model/shopping/category');
const DeliveryModel = require('../../database/model/shopping/delivery');
const ActivityModel = require('../../database/model/shopping/activity');
const Base = require('../../utils/baseConfig');

class Category extends Base{
    constructor (req, res, next) {
        super(req, res, next);
    }

    // 获取所有餐馆分类和数量
    async getCategories (req, res, next) {
        try {
            const categories = await CategoryModel.find({}, '-_id');
            this.json(200, 'success', categories);
        } catch (err) {
            console.log('获取categories失败 getCategories catch err');
            this.json(400, '获取categories失败 getCategories catch err', {});
        }
    }

    async addCategory (type) {
        try {
            await CategoryModel.addCategory(type);
        } catch (err) {
            console.log('增加category数量失败');
        }
    }

    async findById (id) {
        try {
            const cateEntity = await CategoryModel.findOne({'sub_categories.id': id});
            let categoryName = cateEntity.name;
            cateEntity.sub_categories.forEach(item => {
                if (item.id == id) {
                    categoryName += '/' + item.name;
                }
            });
            return categoryName;
        } catch (err) {
            console.log('通过category id获取数据失败 catch err');
            throw new Error(err);
        }
    }

    // 获取配送方式
    async getDelivery (req, res, next) {
        try {
            const deliveries = await DeliveryModel.find({}, '-_id');
            this.json(200, 'ok', deliveries);
        } catch (err) {
            console.log('获取配送方式数据失败 getDelivery catch err', err);
            this.json(400, '获取配送方式数据失败 getDelivery catch err', {});
        }
    }

    // 获取活动列表
    async getActivity (req, res, next) {
        try {
            const activities = await ActivityModel.find({}, '-_id');
            this.json(200, 'ok', activities);
        } catch (err) {
            console.log('获取活动数据失败 getActivity catch err');
            this.json(400, '获取活动数据失败 getActivity catch err', {});
        }
    }
}

module.exports = Category;
