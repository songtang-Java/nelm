const AddressConfig = require('../../utils/addressConfig');
const formidable = require('formidable');
const PaymentsModel = require('../../database/model/v1/payments');
const ShopModel = require('../../database/model/shopping/shop');
const CartModel = require('../../database/model/v1/cart');

class Carts extends AddressConfig {
    constructor (req, res, next) {
        super(req, res, next);
        this.extra = [{
            description: '',
            name: '餐盒',
            price: 0,
            quantity: 1,
            type: 0
        }]
    }

    async checkout (req, res, next) {
        const UID = req.session.UID;
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {geohash, entities = [], restaurant_id} = fields;
            try {
                const checkEntities = entities instanceof Array || entities.length;
                this.verifySingleParam(checkEntities, 'entities参数错误');
                const checkEntity = entities[0] instanceof Array || entities[0].length;
                this.verifySingleParam(checkEntity, 'entities参数错误');
                this.verifySingleParam(restaurant_id, 'restaurant_id参数错误');

                let payments = await PaymentsModel.find({}, '-_id'); // 付款方式
                let cart_id = await this.getId('cart_id'); // 购物车id
                let restaurant = await ShopModel.find({id: restaurant_id}); // 餐馆详情
                let from = geohash.split(',')[0] + ',' + geohash.split(',')[1];
                const to = restaurant.latitude + ',' + restaurant.longitude;
                let delivery_time = await this.getDistance(from, to, 'timevalue'); // 配送时间
                let delivery_reach_time = this.filterTime(delivery_time); // 到达时间
                const deliver_amount = 4; //
                let price = 0; // 商品价格
                entities[0].map(item => {
                    price += item.price * item.quantity;
                    if (item.packing_fee) {
                        this.extra[0].price += item.packing_fee * item.quantity;
                    }
                    if (item.specs[0]) {
                        return item.name = `${item.name}-${item.specs[0]}`;
                    }
                });
                // 食品总价格
                const total = price + this.extra[0].price * this.extra[0].quantity + deliver_amount;
                // 是否支持发票
                let invoice = {
                    is_available: false,
                    status_text: '商家不支持开发票'
                };
                restaurant.supports.forEach(item => {
                    if (item.icon_name === '票') {
                        invoice = { is_available: true, status_text: '不需要开发票' };
                    }
                })
                const checkoutInfo = {
                    id: cart_id,
                    cart: {
                        id: cart_id,
                        groups: entities,
                        extra: this.extra,
                        deliver_amount,
                        is_deliver_by_fengniao: !!restaurant.delivery_mode,
                        original_total: total,
                        phone: restaurant.phone,
                        restaurant_id,
                        restaurant_info: restaurant,
                        restaurant_minimum_order_amount: restaurant.float_minimum_order_amount,
                        total,
                        user_id: UID
                    },
                    delivery_reach_time,
                    invoice,
                    sig: Math.ceil(Math.random()*1000000).toString(),
                    payments
                }

                const newCart = new CartModel(checkoutInfo);
                const cart = await newCart.save();
                this.json(200, 'success', cart);
            } catch (err) {
                console.log('保存购物车数据失败' + err);
                this.json(400, '加入购物车失败 catch err', {});
            }
        })
    }

    // 过滤送达时间
    filterTime(deliverTime) {
        let time = new Date().getTime() + deliverTime * 1000;
        let hour = ('0' + new Date(time).getHours()).substr(-2);
        let minutes = ('0' + new Date(time).getMinutes()).substr(-2);
        return hour + ':' + minutes;
    }
}

module.exports = Carts;
