const mongoose = require("mongoose");

/**
 * 收获地址模型
 */
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    id: Number,
    user_id: Number, // 用户ID
    address: String, // 地址信息
    address_detail: String, // 详细地址信息
    is_valid: {type: Number, default: 1},
    name: String, // 收货人姓名
    phone: String, // 收获手机号
    phone_bk: String,
    sex: {type: Number, default: 1}, // 收货人性别
    geohash: String,
    poi_type: {type: Number, default: 0},
    city_id: {type: Number, default: 1},
    tag: {type: String, default: '家'}, // 标签
    tag_type: Number, // 标签类型
    is_user_default: {type: Boolean, default: true},
    is_deliverable: {type: Boolean, default: true},
    agent_fee: {type: Number, default: 0},
    deliver_amount: {type: Number, default: 0},
    phone_had_bound: {type: Boolean, default: true},
}, {versionKey: false, timestamps: {createdAt: 'created_time', updatedAt: 'updated_time'}});
addressSchema.index({id: 1});

module.exports = mongoose.model('Address', addressSchema);
