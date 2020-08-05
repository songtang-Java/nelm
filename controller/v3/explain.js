const ExplainModel = require('../../database/model/v3/explain');
const BaseConfig = require('../../utils/baseConfig');

class Explain extends BaseConfig{
    constructor (props) {
        super(props);
    }

    async getExplain (req, res, next) {
        try {
            const explain = await ExplainModel.findOne();
            this.json(200, 'success', explain.data);
        } catch (err) {
            console.log('获取服务中心数据失败 catch err', err);
            this.json(400, '获取服务中心数据失败 catch err', {});
        }
    }
}

module.exports = Explain;
