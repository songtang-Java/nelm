const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    avatar: { // 头像
        type: String,
        default: 'default_avatar.jpg'
    },
    balance: {
        type: Number,
        default: 0
    },
    brand_member_new: {
        type: Number,
        default: 0
    },
    current_address_id: { // 当前地址id
        type: Number,
        default: 0
    },
    current_invoice_id: {
        type: Number,
        default: 0
    },
    delivery_card_expire_days: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        default: ''
    },
    gift_amount: {
        type: Number,
        default: 3
    },
    city: String,
    register_time: String, // 注册时间
    id: Number,
    userId: Number, // 用户id
    username: String,
    is_active: {
        type: Number,
        default: 1
    },
    is_email_valid: {
        type: Boolean,
        default: false
    },
    is_mobile_valid: {
        type: Boolean,
        default: true
    },
    mobile: {
        type: String,
        default: ''
    },
    point: {
        type: Number,
        default: 0
    },
    column_desc: {
        game_desc: {
            type: String,
            default: '玩游戏领红包'
        },
        game_image_hash: {
            type: String,
            default: '05f108ca4e0c543488799f0c7c708cb1jpeg' // 目前不确定是何物
        },
        game_is_show: {
            type: Number,
            default: 1
        },
        game_link: {
            type: String,
            default: 'https://gamecenter.faas.ele.me'
        },
        gift_mall_desc: {
            type: String,
            default: '0元好物在这里'
        }
    }
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

userInfoSchema.index({id: 1});

const userInfo = mongoose.model('userInfo', userInfoSchema);

module.exports = userInfo;
