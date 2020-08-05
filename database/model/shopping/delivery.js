/**
 * 配送方式模型
 */
const mongoose = require("mongoose");
const deliveryData = require("../../../initData/deliveryInit");

const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    color: String,
    id: Number,
    is_solid: Boolean,
    text: String,
});

deliverySchema.index({id: 1});

const Delivery = mongoose.model('Delivery', deliverySchema);

Delivery.findOne((err, data) => {
    if (!data) {
        Delivery.create(deliveryData);
    }
});

module.exports = Delivery;
