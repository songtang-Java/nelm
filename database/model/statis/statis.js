/**
 * 数据统计模型
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statisSchema = new Schema({
    date: String,
    origin: String,
    id: Number,
});

statisSchema.index({id: 1});

module.exports = mongoose.model('Statis', statisSchema);
