/**
 * 备注模型
 */

const mongoose = require("mongoose");
const remarkInitData = require("../../../initData/remark");

const Schema = mongoose.Schema;

const remarkSchema = new Schema({
    remarks: []
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

const Remarks = mongoose.model('Remarks', remarkSchema);

Remarks.findOne((err, data) => {
    if (!data) {
        Remarks.create(remarkInitData)
    }
});
module.exports = Remarks;
