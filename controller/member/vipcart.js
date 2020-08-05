const Base = require('../../utils/baseConfig');

class VipCart extends Base{
    constructor (props) {
        super(props);
    }

    async useCart (req, res, next) {
        this.json(400, '无效的卡号', {});
    }
}

module.exports = VipCart;
