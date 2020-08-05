const StaticsModel = require('../../database/model/statis/statis');
const UserInfoModel = require('../../database/model/v2/userInfo');
const OrderModel = require('../../database/model/order/order');
const AdminModel = require('../../database/model/admin/index');
const Base = require('../../utils/baseConfig');
const {startOfDay, endOfDay, format} = require('date-fns');

class Statics extends Base{
    constructor (req, res, next) {
        super(req, res, next);
    }

    async apiCount(req, res, next){
        const date = req.query.date;
        this.verifySingleParam(date, '参数错误')
        try{
            const count = await StaticsModel.find({date}).count();
            this.json(200, 'success', count);
        }catch(err){
            console.log('获取当天API请求次数失败 catch err', err);
            this.json(400, '获取当天API请求次数失败 catch err', {});
        }
    }

    async apiAllCount(req, res, next){
        try{
            const count = await StaticsModel.count();
            this.json(200, 'success', count);
        }catch(err){
            console.log('获取所有API请求次数失败 catch err');
            this.json(400, '获取所有API请求次数失败 catch err', {});
        }
    }

    async allApiRecord(req, res, next){
        try{
            const allRecord = await StaticsModel.find({}, '-_id -__v');
            this.json(200, 'success', allRecord);
        }catch(err){
            console.log('获取所有API请求信息失败 catch err', err);
            this.json(400, '获取所有API请求信息失败 catch err', {});
        }
    }

    // 获取当日用户注册人数
    async userCount(req, res, next){
        const date = req.query.date;
        const startTime = startOfDay(new Date(date));
        const endTime = endOfDay(new Date(date));
        this.verifySingleParam(date, '参数错误');
        try{
            const count = await UserInfoModel.find({create_time: {$gte: startTime, $lt: endTime}}).countDocuments();
            this.json(200, 'success', count);
        }catch(err){
            console.log('获取当天注册人数失败 catch err', err);
            this.json(400, '获取当天注册人数失败 catch err', {});
        }
    }

    // 获取当天新增注册管理员人数
    async adminCount(req, res, next){
        const date = req.query.date;
        const startTime = startOfDay(new Date(date));
        const endTime = endOfDay(new Date(date));
        this.verifySingleParam(date, '参数错误');
        try{
            const count = await AdminModel.find({create_time: {$gte: startTime, $lt: endTime}}).countDocuments();
            this.json(200, 'success', count);
        }catch(err){
            console.log('获取当天注册管理员人数失败 catch err', err);
            this.json(400, '获取当天注册管理员人数失败 catch err', {})
        }
    }

    // 获取当天订单数量
    async orderCount(req, res, next){
        const date = req.query.date;
        const startTime = startOfDay(new Date(date));
        const endTime = endOfDay(new Date(date));
        this.verifySingleParam(date, '参数错误');
        try{
            const count = await OrderModel.find({formatted_created_at: {$gte: startTime, $lt: endTime}}).countDocuments();
            this.json(200, 'success', count);
        }catch(err){
            console.log('获取当天订单数量失败 catch err', err);
            this.json(400, '获取当天订单数量失败 catch err', {});
        }
    }
}

module.exports = Statics;
