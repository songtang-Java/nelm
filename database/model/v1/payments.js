/**
 * 付款方式模型
 */
const mongoose = require("mongoose");
const paymentsData = require("../../../initData/payments");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    description: String,
    disabled_reason: String,
    id: Number,
    is_online_payment: {type: Boolean, default: true},
    name: String,
    promotion: [],
    select_state: Number
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

const Payments = mongoose.model('Payments', paymentSchema);

// 初始化数据
Payments.findOne((err, data) => {
    if (!data) {
        paymentsData.forEach(item => {
            Payments.create(item)
        })
    }
});

module.exports = Payments;
