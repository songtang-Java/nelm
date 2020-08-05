/**
 * 红包 controller
 */
const BaseConfig = require("../../utils/baseConfig");
const redPaperModel = require("../../database/model/promotion/redPaper");

class RedPaper extends BaseConfig{
    constructor(req, res, next) {
        super(req, res, next)
    }
    async getRedEnvelope (req, res, next) {
        this.handleRedEnvelope(req, res, 'onTime');
    }
    async getExpiredRedEnvelope (req, res, next) {
        this.handleRedEnvelope(req, res, 'expired');
    }
    async handleRedEnvelope (req, res, type) {
        try {
            const present_status = type === 'onTime' ? 1 : 4;
            const userId = req.params.userId;
            const {limit = 0, offset = 0} = req.query;
            this.verifySingleParam(+userId, 'userId参数错误');
            this.verifySingleParam(+limit, 'limit参数错误');
            this.verifySingleParam(+offset, 'offset参数错误');
            const redEnvelope = await redPaperModel.find({present_status}, '-_id').limit(Number(limit)).skip(Number(offset));
            this.json(200, 'success', redEnvelope);
        } catch (err) {
            this.json(400, err + 'catch error', {});
        }
    }
    async exchange () {
        this.json(400, '无效的兑换码', {});
    }
}

module.exports = RedPaper;
