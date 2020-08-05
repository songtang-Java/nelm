/**
 * 收获地址 controller
 */
const baseConfig = require("../../utils/baseConfig");
const AddressModel = require("../../database/model/v1/address");
const formidable = require("formidable");

class Address extends baseConfig {
    constructor(req, res, next) {
        super(req, res, next);
    }
    // 获取收获地址列表
    async getAddress(req, res, next) {
        const user_id = req.params.user_id;
        if (!user_id || !Number(user_id)) {
            res.send({
                type: 'ERROR_USER_ID',
                message: 'user_id参数错误',
            });
            return;
        }
        try {
            const addressList = await AddressModel.find({user_id}, '-_id');
            res.send(addressList);
        } catch (err) {
            console.log('获取收获地址列表失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取收获地址列表失败'
            })
        }
    }

    // 增加收获地址
    async addAddress(req, res, next) {
        const form = new formidable.IncomingForm;
        form.parse(req, async (err, fields, files) => {
            const user_id = req.params.user_id;
            const {address, phone, address_detail, geohash, name, phone_bk, poi_type = 0, sex, tag, tag_type} = fields;
            const argument = {user_id, address, phone, address_detail, geohash, name, phone_bk, poi_type, sex, tag, tag_type};
            try {
                this.judgeArgumentSave(argument); // 判断参数是否合法
            } catch (err) {
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    msg: err.message
                });
                return;
            }
            try {
                const address_id = await this.getId('address_id');
                const newAddress = {
                    id: address_id,
                    address,
                    phone,
                    phone_bk: phone_bk && phone_bk,
                    name,
                    geohash,
                    address_detail,
                    sex,
                    tag,
                    tag_type,
                    user_id
                };
                await AddressModel.create(newAddress);
                res.send({
                    status: 1,
                    success: '添加地址成功'
                })
            } catch (err) {
                console.log('添加地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_ADDRESS',
                    msg: '添加地址失败'
                })
            }
        })
    }

    // 删除地址信息
    async deleteAddress(req, res, next) {
        const {user_id, address_id} = req.body;
        if (!user_id || !Number(user_id) || !address_id || !Number(address_id)) {
            res.send({
                type: 'ERROR_PARAMS',
                msg: '参数错误',
            });
            return;
        }
        try {
            await AddressModel.findOneAndRemove({id: address_id});
            res.send({
                status: 1,
                success: '删除地址信息成功',
            })
        } catch (err) {
            console.log('删除收获地址失败', err);
            res.send({
                type: 'ERROR_DELETE_ADDRESS',
                msg: '删除收获地址失败'
            })
        }
    }

    // 根据id查询收获地址信息
    async getAddressById(req, res, next) {
        const {address_id} = req.query;
        if (!address_id || !Number(address_id)) {
            res.send({
                type: 'ERROR_PARAMS',
                msg: '参数错误',
            });
            return;
        }
        try {
            const address = await AddressModel.findOne({id: address_id});
            res.send(address);
        } catch (err) {
            console.log('根据id获取地址信息失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                msg: '根据id获取地址信息失败'
            })
        }
    }

    judgeArgumentSave(argument) {
        const {user_id, address, phone, address_detail, geohash, name, phone_bk, poi_type, sex, tag, tag_type} = argument;
        if (!user_id || !Number(user_id)) {
            throw new Error('用户ID参数错误');
        } else if (!address) {
            throw new Error('地址信息错误');
        } else if (!address_detail) {
            throw new Error('详细地址信息错误');
        } else if (!geohash) {
            throw new Error('geohash参数错误');
        } else if (!name) {
            throw new Error('收货人姓名错误');
        } else if (!phone) {
            throw new Error('收获手机号错误');
        } else if (!sex) {
            throw new Error('收货人性别错误');
        } else if (!tag) {
            throw new Error('标签错误');
        } else if (!tag_type) {
            throw new Error('标签类型错误');
        }
    }
}

module.exports = Address;
