const BaseConfig = require('../../utils/baseConfig');
const formidable = require('formidable');
const OrderModel = require('../../database/model/order/order');
const CartModel = require('../../database/model/v1/cart');
const AddressModel = require('../../database/model/v1/address');

class Order extends BaseConfig {
    constructor(req, res, next) {
        super(req, res, next);
    }

    async postOrder (req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            this.verifySingleParam(err, '下单失败');
            const {user_id, cart_id} = req.params;
            const {address_id, come_from = 'mobile_web', deliver_time = '', description, entities, geohash, paymethod_id = 1} = fields;
            try {
                const checkEntities = entities instanceof Array || entities.length;
                this.verifySingleParam(checkEntities, 'entities参数错误');
                const checkEntity = entities[0] instanceof Array || entities[0].length;
                this.verifySingleParam(checkEntity, 'entities参数错误');
                this.verifySingleParam(address_id, 'address_id参数错误');
                this.verifySingleParam(user_id, '未登录');
                this.verifySingleParam(cart_id, 'cart_id参数错误');

                let cartDetail = await CartModel.findOne({id: cart_id});
                let order_id = await this.getId('order_id');
                let deliver_fee = {price: cartDetail.cart.deliver_amount};
                const orderObject = {
                    basket: {
                        group: entities,
                        packing_fee: {
                            name: cartDetail.cart.extra[0].name,
                            price: cartDetail.cart.extra[0].price,
                            quantity: cartDetail.cart.extra[0].quantity
                        },
                        deliver_fee
                    },
                    restaurant_id: cartDetail.cart.restaurant_id,
                    restaurant_image_url: cartDetail.cart.restaurant_info.image_path,
                    restaurant_name:  cartDetail.cart.restaurant_info.name,
                    order_time: new Date().getTime(),
                    time_pass: 900,
                    status_bar: {
                        color: 'f60',
                        image_type: '',
                        sub_title: '15分钟内支付',
                        title: '',
                    },
                    total_amount: cartDetail.cart.total,
                    total_quantity: entities[0].length,
                    unique_id: order_id,
                    id: order_id,
                    user_id,
                    address_id,
                }
                await OrderModel.create(orderObject);
                this.json(200, '下单成功，请及时付款', {need_validation: false})
            } catch (err) {
                console.log('保存订单数据失败' + err);
                this.json(400, '保存订单数据失败 catch err', {});
            }
        })
    }

    async getOrders (req, res, next) {
        const user_id = req.query.user_id;
        const {page = 0, size = 0} = req.query;
        try {
            this.verifySingleParam(user_id, '未登录，请重新登录');
            let orders  = await OrderModel.find({user_id}).sort({create_time: -1}).limit(Number(size)).skip(Number(page));
            orders = this.filterStatusTitle(orders);
            this.json(200, 'success', orders);
        } catch (err) {
            console.log('获取订单列表失败 catch err', err);
            this.json(400, '获取订单列表失败 catch err', {});
        }
    }

    async getDetail (req , res, next) {
        const {user_id, order_id} = req.query;
        try {
            this.verifySingleParam(user_id, '未登录，请重新登录');
            this.verifySingleParam(order_id, 'order_id参数错误');
            const order = await OrderModel.findOne({id: order_id}, '-_id');
            const addressDetail = await AddressModel.findOne({id: order.address_id});
            const orderDetail = {
                ...order,
                ...{
                    addressDetail: addressDetail.address,
                    consignee: addressDetail.name,
                    deliver_time: '尽快送达', pay_method: '在线支付', phone: addressDetail.phone
                }
            }
            this.json(200, 'success', orderDetail);
        } catch (err) {
            console.log('获取订单信息失败 catch err', err);
            this.json(400, '获取订单信息失败 catch err', {});
        }
    }

    async getAllOrders (req, res, next) {
        const {restaurant_id, page, size} = req.query;
        try {
            let filter = restaurant_id && Number(restaurant_id) ? {restaurant_id} : {};
            let orders = await OrderModel.find(filter).sort({create_time: -1}).limit(Number(size)).skip(Number(page));
            orders = this.filterStatusTitle(orders);
            this.json(200, 'success', orders);
        } catch (err) {
            console.log('获取订单数据失败 catch err' + err);
            this.json(400, '获取订单数据失败 catch err', {});
        }
    }

    async getOrdersCount (req, res, next) {
        const {restaurant_id} = req.query;
        try {
            let filter = restaurant_id && Number(restaurant_id) ? {restaurant_id} : {};
            const count = await OrderModel.find(filter).count();
            this.json(200, 'success', count);
        } catch (err) {
            console.log('获取订单总数错误 catch err' ,err);
            this.json(400, '获取订单总数错误 catch err', {});
        }
    }

    // 过滤orders的时间
    filterStatusTitle (orders) {
        const timeNow = new Date().getTime();
        return orders.map(item => {
            item.status_bar.title = timeNow - item.order_time < 900000 ? '等待支付' : '支付超时';
            item.time_pass = Math.ceil((timeNow - item.order_time) / 1000);
            item.save();
            return item;
        })
    }
}

module.exports = Order;
