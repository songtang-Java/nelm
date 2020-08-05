const BaseConfig = require('./baseConfig');

/*
腾讯地图和百度地图API统一调配组件
 */

class AddressConfig extends BaseConfig {
    constructor(req, res, next) {
        super(req, res, next);
        this.tencentkey = 'RLHBZ-WMPRP-Q3JDS-V2IQA-JNRFH-EJBHL';
        this.baidukey = 'fjke3YUipM9N64GdOIh1DNeK2APO2WcT';
    }

    // 根据ip获取定位位置信息
    async guessPosition(req) {
        return new Promise(async (resolve, reject) => {
            let ip;
            const defaultIp = '180.158.102.141'; // 上海
            // const defaultIp = '123.125.71.38'; // 北京
            if (process.env.NODE_ENV === 'development') {
                ip = defaultIp;
                console.log('QAQ线下环境');
            } else {
                console.log('-----------------------------')
                console.log('QAQ线上环境');
                console.log('-----------------------------')
                try {
                    ip = req.headers['x-forwarded-for'] ||
                         req.connection.remoteAddress ||
                         req.socket.remoteAddress ||
                         req.connection.socket.remoteAddress;
                    const ipArr = ip.split(':');
                    ip = ipArr[ipArr.length - 1] || defaultIp; // 取最后一段即为正确格式的ip地址
                } catch (err) {
                    ip = defaultIp;
                }
            }
            try {
                let resultData = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
                    ip,
                    key: this.tencentkey
                });
                if (resultData.status === 0) {
                    console.log(resultData);
                    const cityInfo = {
                        lat: resultData.result.location.lat,
                        lng: resultData.result.location.lng,
                        city: resultData.result.ad_info.city
                    };
                    cityInfo.city = cityInfo.city.replace(/市$/, '');
                    console.log(cityInfo);
                    resolve(cityInfo);
                } else {
                    console.log('定位失败');
                    reject('定位失败');
                }
            } catch (err) {
                reject(err);
            }
        })
    }

    // 根据关键词和限定地名搜索位置信息
    async searchPlace(keyword, cityName, type = 'search') {
        try {
            const searchResObj = await this.fetch('http://apis.map.qq.com/ws/place/v1/search', {
                key: this.tencentkey,
                keyword: encodeURIComponent(keyword),
                boundary: 'region(' + encodeURIComponent(cityName) + ',0)',
                page_size: 10
            });
            if (searchResObj.status === 0) {
                return searchResObj;
            } else {
                throw new Error('搜索位置信息失败');
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    // 通过ip地址获取精确位置
    async getDetailPosByIp (req) {
        try {
            const address = await this.guessPosition(req);
            const params = {
                key: this.tencentkey,
                location: `${address.lat},${address.lng}`
            };
            let res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
            console.log(res);
            if (res.status === 0) {
                return res;
            } else {
                throw new Error('获取具体位置信息失败');
            }
        } catch (err) {
            console.log('根据ip获取定位失败', err);
            throw new Error(err);
        }
    }

    // 通过geohash获取精确位置
    async getPosition(latitude, longitude) {
        try {
            const params = {
                key: this.tencentkey,
                location: `${latitude},${longitude}`
            }
            let res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
            if (res.status === 0) {
                return res;
            } else {
                throw new Error('通过geohash获取具体位置失败');
            }
        } catch (err) {
            console.log('getPosition获取定位失败 catch', err);
            throw new Error(err);
        }
    }
}

module.exports = AddressConfig;
