/**
 * 红包模型
 */
const mongoose = require("mongoose");
const redPaperData = require("../../../initData/redPaperInit");

const Schema = mongoose.Schema;

const redPaperSchema = new Schema({
    id: Number,
    sn: String,
    user_id: Number,
    amount: Number,
    sum_condition: Number,
    name: String,
    phone: String,
    begin_date: String, // 开始时间
    end_date: String,
    description_map: {
        phone: String,
        online_paid_only: String,
        validity_delta: String,
        validity_periods: String,
        sum_condition: String,
    },
    limit_map: {},
    status: Number,
    present_status: Number, // 当前状态
    share_status: Number,
});

redPaperSchema.index({id: 1});

const redPaper = mongoose.model('redPaper', redPaperSchema);

redPaper.findOne((err, data) => {
    if (!data) {
        redPaperData.forEach(item => {
            redPaper.create(item)
        })
    }
});

module.exports = redPaper;
