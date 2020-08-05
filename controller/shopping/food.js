const {Food: FoodModel, Menu: MenuModel} = require('../../database/model/shopping/food');
const ShopModel = require('../../database/model/shopping/shop');
const Base = require('../../utils/baseConfig');
const formidable = require('formidable');

class Food extends Base{
    constructor (props) {
        super(props);
        this.defaultData = [{
            name: '热销榜',
            description: '大家喜欢吃，才叫真好吃。',
            icon_url: "5da3872d782f707b4c82ce4607c73d1ajpeg",
            is_selected: true,
            type: 1,
            foods: [],
        }, {
            name: '优惠',
            description: '美味又实惠, 大家快来抢!',
            icon_url: "4735c4342691749b8e1a531149a46117jpeg",
            type: 1,
            foods: [],
        }]
    }

    async initData (restaurant_id) {
        for (let i = 0; i < this.defaultData.length; i++) {
            let categoryId;
            try {
                categoryId = await this.getId('category_id');
            } catch (err) {
                console.log('获取category_id失败');
                throw new Error(err);
            }
            const defaultData = this.defaultData[i];
            const category = {...defaultData, id: categoryId, restaurant_id}
            const newFood = new MenuModel(category);
            try {
                await newFood.save();
                console.log('初始化食品数据成功');
            } catch (err) {
                console.log('初始化食品数据失败');
                throw new Error(err);
            }
        }
    }

    async getCategory (req ,res ,next) {
        const restaurant_id = req.query.restaurant_id;
        try {
            const categoryList = await MenuModel.find({restaurant_id});
            this.json(200, 'success', categoryList);
        } catch (err) {
            console.log('获取餐馆食品种类失败 getCategory catch err', err);
            this.json(400, '获取餐馆食品种类失败 getCategory catch err', {});
        }
    }

    async addCategory (req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                this.verifySingleParam(fields.name, '必须填写食品类型名称');
                this.verifySingleParam(fields.restaurant_id, '餐馆ID错误');
                let categoryId = await this.getId('category_id');
                const foodObj = {
                    name: fields.name,
                    description: fields.description,
                    restaurant_id: fields.restaurant_id,
                    id: categoryId,
                    foods: []
                }
                const newFood = new MenuModel(foodObj);
                await newFood.save();
                this.json(200, '添加食品种类成功', {});
            } catch (err) {
                console.log('addCategory catch err', err);
                this.json(400, 'addCategory catch err', {});
            }
        })
    }

    async addFood (req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                this.verifySingleParam(fields.name, '必须填写食品名称');
                this.verifySingleParam(fields.image_path, '必须上传食品图片');
                this.verifySingleParam(fields.specs.length, '至少填写一种规格');
                this.verifySingleParam(fields.category_id, '食品类型ID错误');
                this.verifySingleParam(fields.restaurant_id, '餐馆ID错误');
                let category = await MenuModel.findOne({id: fields.category_id});
                let restaurant = await ShopModel.findOne({id: fields.restaurant_id});
                let itemId = await this.getId('item_id');
                const ratingCount = Math.ceil(Math.random() * 1000);
                const monthSales = Math.ceil(Math.random()*1000);
                const tips = `${ratingCount}评价 月售${monthSales}份`;
                const newFood = {
                    name: fields.name,
                    description: fields.description,
                    image_path: fields.image_path,
                    activity: null,
                    attributes: [],
                    restaurant_id: fields.restaurant_id,
                    category_id: fields.category_id,
                    satisfy_rate: Math.ceil(Math.random()*100),
                    satisfy_count: Math.ceil(Math.random()*1000),
                    item_id,
                    rating: (4 + Math.random()).toFixed(1),
                    rating_count: ratingCount,
                    month_sales: monthSales,
                    tips,
                    specfoods: [],
                    specifications: [],
                };
                if (fields.activity) {
                    newFood.activity = {
                        image_text_color: 'f1884f',
                        icon_color: 'f07373',
                        image_text: fields.activity
                    }
                }
                if (fields.attributes.length) {
                    fields.attributes.forEach(item => {
                        let attr;
                        switch (item) {
                            case '新':
                                attr = {
                                    icon_color: '5ec452',
                                    icon_name: '新'
                                };
                                break;
                            case '招牌':
                                attr = {
                                    icon_color: 'f07373',
                                    icon_name: '招牌'
                                };
                                break;
                        }
                        newFood.attributes.push(attr);
                    })
                }
                const [specfoods, specifications] = await this.getSpecFoods(fields, item_id);
                newFood.specfoods = specfoods;
                newFood.specifications = specifications;
                const foodEntity = await FoodModel.create(newFood);
                category.foods.push(foodEntity);
                category.markModified('foods');
                await category.save();
                this.json(200, '添加食品成功',{});
            } catch (err) {
                console.log('保存食品到数据库失败 catch err', err);
                this.json(400, '保存食品到数据库失败 catch err', {});
            }
        })
    }

    async getSpecFoods (fields, item_id) {
        let specFoods = [], specifications = [];
        if (fields.specs.length < 2) {
            try {
                let food_id = await this.getId('food_id');
                let sku_id = await this.getId('sku_id');
                specFoods.push({
                    packing_fee: fields.specs[0].packing_fee,
                    price: fields.specs[0].price,
                    specs: [],
                    specs_name: fields.specs[0].specs,
                    name: fields.name,
                    item_id,
                    sku_id,
                    food_id,
                    restaurant_id: fields.restaurant_id,
                    recent_rating: (Math.random()*5).toFixed(1),
                    recent_popularity: Math.ceil(Math.random()*1000),
                })
            } catch (err) {
                console.log('获取sku_id、food_id失败 catch err', err);
                throw new Error('获取sku_id、food_id失败');
            }
        } else {
            specifications.push({
                values: [],
                name: "规格"
            });
            for (let i = 0; i < fields.specs.length; i++) {
                try{
                    let sku_id = await this.getId('sku_id');
                    let food_id = await this.getId('food_id');
                    specFoods.push({
                        packing_fee: fields.specs[i].packing_fee,
                        price: fields.specs[i].price,
                        specs: [{
                            name: "规格",
                            value: fields.specs[i].specs
                        }],
                        specs_name: fields.specs[i].specs,
                        name: fields.name,
                        item_id,
                        sku_id: sku_id,
                        food_id,
                        restaurant_id: fields.restaurant_id,
                        recent_rating: (Math.random()*5).toFixed(1),
                        recent_popularity: Math.ceil(Math.random()*1000),
                    })
                }catch(err){
                    console.log('获取sku_id、food_id失败 else catch err', err);
                    throw new Error('获取sku_id、food_id失败, else catch err');
                }
                specifications[0].values.push(fields.specs[i].specs);
            }
        }
        return [specFoods, specifications];
    }

    async getMenu(req, res, next){
        const restaurant_id = req.query.restaurant_id;
        const allMenu = req.query.allMenu;
        this.verifySingleParam(restaurant_id, '获取餐馆参数ID错误');
        let filter = allMenu ? {restaurant_id} : {restaurant_id, $where: function(){return this.foods.length}};
        try{
            const menu = await MenuModel.find(filter, '-_id');
            this.json(200, 'success', menu);
        }catch(err){
            console.log('获取食品数据失败 catch err', err);
            this.json(400, '获取食品数据失败 catch err', {});
        }
    }

    async getMenuDetail(req, res, next){
        const category_id = req.query.category_id;
        this.verifySingleParam(category_id, '获取Menu详情参数ID错误');
        try{
            const menu = await MenuModel.findOne({id: category_id}, '-_id');
            this.json(200, 'success', menu);
        }catch(err){
            console.log('获取Menu详情失败 catch err', err);
            this.json(400, '获取Menu详情失败 catch err', {});
        }
    }

    async getFoods(req, res, next){
        const {restaurant_id, size = 20, page = 1} = req.query;
        try{
            let filter = {};
            if (restaurant_id && Number(restaurant_id)) {
                filter = {restaurant_id}
            }
            const foods = await FoodModel.find(filter, '-_id').sort({item_id: -1}).limit(Number(size)).skip(Number(page));
            this.json(200, 'success', foods);
        }catch(err){
            console.log('获取食品数据失败 catch err', err);
            this.json(400, '获取食品数据失败 catch err', {});
        }
    }

    async getFoodsCount(req, res, next){
        const restaurant_id = req.query.restaurant_id;
        try{
            let filter = {};
            if (restaurant_id && Number(restaurant_id)) {
                filter = {restaurant_id}
            }
            const count = await FoodModel.find(filter).count();
            this.json(200, 'success', count);
        }catch(err){
            console.log('获取食品数量失败 catch err', err);
            this.json(400, '获取食品数量失败 catch err', {});
        }
    }

    async updateFood(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取食品信息form出错', err);
                return this.json(400, '表单信息错误', {});
            }
            const {name, item_id, description = "", image_path, category_id, new_category_id} = fields;
            try{
                this.verifySingleParam(name, '食品名称错误');
                this.verifySingleParam(item_id, '食品ID错误');
                this.verifySingleParam(category_id, '食品分类ID错误');
                this.verifySingleParam(image_path, '食品图片地址错误');
                const [specFoods, specifications] = await this.getSpecFoods(fields, item_id);
                let newData = {};
                if (new_category_id !== category_id) {
                    newData = {name, description, image_path, category_id: new_category_id, specFoods, specifications};
                    const food = await FoodModel.findOneAndUpdate({item_id}, {$set: newData});
                    const menu = await MenuModel.findOne({id: category_id});
                    const targetMenu = await MenuModel.findOne({id: new_category_id});
                    let subFood = menu.foods.id(food._id);
                    subFood.set(newData);
                    targetMenu.foods.push(subFood);
                    targetMenu.markModified('foods');
                    await targetMenu.save();
                    await subFood.remove();
                    await menu.save()
                }else{
                    newData = {name, description, image_path, specFoods, specifications};
                    const food = await FoodModel.findOneAndUpdate({item_id}, {$set: newData});
                    const menu = await MenuModel.findOne({id: category_id});
                    let subFood = menu.foods.id(food._id);
                    subFood.set(newData);
                    await menu.save()
                }
                this.json(200, '修改食品信息成功', {});
            }catch(err){
                console.log(err.message, err);
                this.json(400, '更新食品信息失败', {});
            }
        })
    }

    async deleteFood(req, res, next){
        const food_id = req.query.food_id;
        this.verifySingleParam(food_id, 'food_id参数错误');
        try{
            const food = await FoodModel.findOne({item_id: food_id});
            const menu = await MenuModel.findOne({id: food.category_id});
            let subFood = menu.foods.id(food._id);
            await subFood.remove();
            await menu.save();
            await food.remove();
            this.json(200, '删除食品成功', {});
        }catch(err){
            console.log('删除食品失败 catch err', err);
            this.json(400, '删除食品失败 catch err', {});
        }
    }
}

module.exports = Food;
