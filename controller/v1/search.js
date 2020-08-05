const AddressConfig = require('../../utils/addressConfig');
const CityModel = require('../../database/model/v1/cities');
const CityController = require('./cities');

class SearchPlace extends AddressConfig {
    constructor (req, res, next) {
        super (req, res, next);
    }

    async search (req, res, next) {
        let {type = 'search', city_id, keyword} = req.query;
        this.verifySingleParam(keyword, '参数错误');
        if (isNaN(city_id)) {
            try {
                const cityName = await CityController.getCityName(req);
                const cityInfo = await CityModel.cityGuess(cityName);
                city_id = cityInfo.id;
            } catch (err) {
                console.log('搜索地址时，获取定位城失败 catch err' + err);
                this.json(400, '搜索地址时，获取定位城失败 catch err', {});
            }
        }
        try {
            const cityInfo = await CityModel.getCityById(city_id);
            const resObj = await this.searchPlace(keyword, cityInfo.name, type);
            console.log('城市信息-----------')
            console.log(resObj)
            console.log('城市信息-----------')
            let cityList = [];
            resObj.data.forEach(item => {
                cityList.push({
                    name: item.title,
                    address: item.address,
                    latitude: item.location.lat,
                    longitude: item.location.lng,
                    geohash: item.location.lat + ',' + item.location.lng
                })
            });
            this.json(200, 'success', cityList);
        } catch (err) {
            console.log('获取地址信息失败 catch2 err' + err);
            this.json(400, '获取地址信息失败 catch2 err', {});
        }
    }
}

module.exports = SearchPlace;
