const mongoose = require("mongoose");
const {getHOST} = require("../../../utils/common");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: String,
    password: String,
    id: Number,
    admin: {
        type: String,
        default: '管理员'
    },
    status: Number, // 1:普通管理、 2:超级管理员
    avatar: {
        type: String,
        default: `default_avatar.jpg`
    },
    city: String,
    online: false // 是否在线
},{versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

adminSchema.index({id: 1});

module.exports = mongoose.model('Admin', adminSchema);
