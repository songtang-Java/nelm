/**
 * 验证码
 */
const AddressConfig = require("../../utils/addressConfig");
const svgCaptcha = require('svg-captcha');
class Captcha extends AddressConfig {
    constructor(req, res, next){
        super(req, res, next)
    }
    async getCaptcha() {
        const cap = svgCaptcha.createMathExpr({
            // 翻转颜色
            inverse: false,
            // 字体大小
            fontSize: 36,
            // 噪声线条数
            noise: 2,
            // 宽度
            width: 80,
            // 高度
            height: 30,
            mathMin: 0,
            mathMax: 9,
            mathOperator: "+/-/*/\/"
        });
        this.req.session.captcha = cap.text; // session 存储验证码数值
        this.res.cookie('cap', cap.text, { maxAge: 15 * 60 * 1000, httpOnly: true });
        this.res.type('svg'); // 响应的类型
        this.res.send(cap.data)
    }
}

module.exports = Captcha;
