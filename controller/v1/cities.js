// /elm-pro/elm-server/controller/v1/cities.js
const Cities = require('../../database/model/v1/cities');
const pinyin = require('pinyin');
const AddressConfig = require('../../utils/addressConfig');

class CityHandle extends AddressConfig {
    constructor(req, res, next) {
        super(req, res, next);
    }
    // 获取城市列表
    async getCity(req, res, next) {
        const type = req.query.type;
        let cityInfo;
        try {
            switch (type) {
                case 'guess':
                    const city = await this.getCityName(req);
                    cityInfo = await Cities.cityGuess(city);
                    break;
                case 'hot':
                    cityInfo = await Cities.cityHot();
                    break;
                case 'group':
                    cityInfo = await Cities.cityGroup();
                    break;
                default:
                    res.json({
                        name: 'ERROR_QUERY_TYPE',
                        msg: '参数错误',
                    });
                    break;
            }
            this.json(200, 'success', cityInfo);
        } catch (err) {
            this.json(301, '获取数据失败', {});
        }
    }

    // 根据Id查询城市详细信息
    async getCityById(req, res, next) {
        console.log('QAQ-------------');
        const cityId = req.params.id;
        if (isNaN(cityId)) {
            res.json({
                name: 'ERROR_PARAM_TYPE',
                msg: '参数错误'
            })
        } else {
            try {
                const cityInfo = await Cities.getCityById(cityId);
                res.send(cityInfo);
            } catch (err) {
                res.send({
                    name: 'ERROR_DATA',
                    msg: '获取数据失败',
                })
            }
        }
    }

    // 获取城市名称拼音
    async getCityName(req) {
        try {
            const cityInfo = await this.guessPosition(req);
            // 把汉字转化为拼音
            const pinyinArr = pinyin(cityInfo.city, {
                style: pinyin.STYLE_NORMAL,
            });
            let cityName = '';
            pinyinArr.forEach(item => {
                cityName += item[0];
            });
            console.log(cityName);
            return cityName;
        } catch (e) {
            return '北京西';
        }
    }

    // 根据ip获取具体位置
    async getDetailAddress(req, res, next) {
        try {
            const position = await this.getDetailPosByIp(req);
            res.send(position);
        } catch (err) {
            console.log('获取精确位置信息失败');
            res.send({
                name: 'ERROR_DATA',
                msg: '获取精确位置信息失败',
            })
        }
    }
    // 根据经纬度详细定位
    async searchPosition(req, res, next) {
        try {
            const geoHash = req.params.geohash || '';
            if (geoHash.indexOf(',') === -1) {
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    msg: '参数错误',
                })
            } else {
                const positionArr = geoHash.split(',');
                const resultData = await this.getPosition(positionArr[0], positionArr[1]);
                const addressData = {
                    address: resultData.result.address,
                    province: resultData.result.province,
                    city: resultData.result.city,
                    geoHash,
                    latitude: positionArr[0],
                    longitude: positionArr[1],
                    name: resultData.result.formatted_addresses.recommend
                }
                res.send(addressData);
            }
        } catch (err) {
            console.log('searchPosition返回信息失败 controller', err);
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                msg: '获取数据失败',
            })
        }
    }
}

module.exports = CityHandle;
