/**
 * 餐馆分类模型
 */
const mongoose = require("mongoose");
const categoryData = require("../../../initData/categoryInit");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    count: Number,
    id: Number,
    ids: [],
    image_url: String,
    level: Number,
    name: String,
    sub_categories: [
        {
            count: Number,
            id: Number,
            image_url: String,
            level: Number,
            name: String,
        }
    ]
});

categorySchema.statics.addCategory = async function (type) {
    const categoryName = type.split('/');
    try {
        const allCate = await this.findOne();
        const subCate = await this.findOne({name: categoryName[0]});
        allCate.count ++;
        subCate.count ++;
        subCate.sub_categories.map(item => {
            if (item.name === categoryName[1]) {
                return item.count ++;
            }
        });
        await allCate.save();
        await subCate.save();
        console.log('保存category成功');
    } catch (err) {
        console.log('保存category失败');
        throw new Error(err);
    }
};

const Category = mongoose.model('Category', categorySchema);

Category.findOne((err, data) => {
    if (!data) {
        for (let i = 0; i < categoryData.length; i++) {
            Category.create(categoryData[i]);
        }
    }
});

module.exports = Category;
