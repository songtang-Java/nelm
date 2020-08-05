const BaseConfig = require('../../utils/baseConfig');
const RemarkModel = require('../../database/model/v1/remark');

class Remark extends BaseConfig {
    constructor (req, res, next) {
        super(req, res, next);
    }

    async getRemarks (req, res, next) {
        const cart_id = req.query.cart_id;
        this.verifySingleParam(cart_id, '购物车ID参数错误');
        try {
            const remarks = await RemarkModel.findOne({}, '-_id');
            this.json(200, 'success', remarks);
        } catch (err) {
            console.log('获取备注数据失败 catch err', err);
            this.json(400, '获取备注数据失败 catch err', {});
        }
    }
}

module.exports = Remark;
