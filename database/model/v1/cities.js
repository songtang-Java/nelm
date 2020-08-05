/**
 * 城市列表模型
 */
const mongoose = require('mongoose');
const cityData = require('../../../initData/cities');

const citySchema = new mongoose.Schema({
    data: {}
});

// 静态方法可以在 model 层使用

// 根据城市名拼音查找对应的城市信息
citySchema.statics.cityGuess = function (name) {
    return new Promise(async (resolve, reject) => {
        const firstWord = name.substr(0, 1).toUpperCase();
        try {
            const city = await this.findOne(); // 例行检查是否已经初始化数据模型，即city.data中是否有数据
            Object.entries(city.data).forEach(item => {
                if (item[0] === firstWord) {
                    item[1].forEach(cityItem => {
                        if (cityItem.pinyin === name) {
                            resolve(cityItem)
                        }
                    })
                }
            })
        }catch (err) {
            reject({
                name: 'ERROR_DATA',
                msg: '查找数据失败'
            });
            console.log(err)
        }
    })
};

// 查询热门城市
citySchema.statics.cityHot = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const city = await this.findOne();
            resolve(city.data.hotCities)
        }catch (err) {
            reject({
                name: 'ERROR_DATA',
                msg: '查找数据失败'
            })
        }
    })
};

// 全部城市
citySchema.statics.cityGroup = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const city = await this.findOne();
            const cityObj = city.data;
            delete(cityObj._id);
            delete(cityObj.hotCities);
            resolve(cityObj);
        } catch (err) {
            reject({
                name: 'ERROR_DATA',
                msg: '查找数据失败',
            });
            console.error(err);
        }
    })
};

// 根据ID查询城市
citySchema.statics.getCityById = function (id) {
   return new Promise(async (resolve, reject) => {
       try {
           const city = await this.findOne();
           Object.entries(city.data).forEach(item => {
               if (item[0] !== '_id' && item[0] !== 'hotCities') {
                   item[1].forEach(cityItem => {
                       if (cityItem.id === Number(id)) {
                           resolve(cityItem);
                       } else {
                            const noneData = {
                                name: 'ERROR_DATA',
                                msg: '没有该id号，查无结果',
                            };
                            resolve(noneData);
                       }
                   })
               }
           })
       } catch (err) {
            reject({
                name: 'ERROR_DATA',
                msg: '查找数据失败',
            })
       }
   })
};

const Cities = mongoose.model('Cities', citySchema); // 建立模型

Cities.findOne((err, data) => {
    if (!data) { // 若该数据模型不存在，则创建，也即初始化数据
        Cities.create({ data: cityData})
    }
});

module.exports = Cities;
