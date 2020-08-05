const fetch = require('node-fetch');
const Ids = require('../database/model/ids');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const qiniu = require('qiniu'); // 七牛云对象存储
const gm = require('gm'); // 图片后台处理插件
const md5 = require("md5");

qiniu.conf.ACCESS_KEY = 'K9rPihqXs43V8pVCLNgnHbxyxO79EFUaj--9Zo5N';
qiniu.conf.SECRET_KEY = 'g1A9jM47lf2nfi2gP8sEohF9xUCuq-3OurApf4AV';

class BaseConfig {
    constructor(req, res, next) {
        this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id',
            'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
        this.imgTypeList = ['shop', 'food', 'avatar','default'];
        this.uploadImg = this.uploadImg.bind(this);
        this.req = req;
        this.res = res;
        this.next = next;
    }
    /**
     * 通用fetch方法二次封装
     */
    async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') { // ES6参数设置默认值
        type = type.toUpperCase(); // 转化为大写
        resType = resType.toUpperCase();
        if (type === 'GET') {
            let dataStr = ''; //数据拼接字符串
            Object.keys(data).forEach(key => { // 返回一个表示给定对象的所有可枚举 属性 的字符串数组
                dataStr += `${key}=${data[key]}&`; // 属性名拼接上属性值
            });
            if (dataStr !== '') { // 将dataStr拼接成 ?a=1&...
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&')); // 把最后一个多余的&删除
                url = `${url}?${dataStr}`;
            }
        }
        let requestConfig = {
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //等价于 body: {}
        };
        if (type === 'POST') {
            Object.defineProperty(requestConfig, 'body', { // 1.当前对象 2.属性名 3.描述(二选一，不能共存)
                value: JSON.stringify(data)
            })
        }
        let responseJson;
        try { // options：headers、response、request、body、fetchError、abortError
            const response = await fetch(url, requestConfig); // fetch(url, options)
            if (resType === 'TEST') {
                responseJson = await response.text();
            } else {
                responseJson = await response.json();
            }
        } catch (err) {
            console.log('获取http数据失败' + err);
            throw new Error(err);
        }
        return responseJson;
    }

    //获取id列表
    async getId(type) {
        if (!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('id类型错误');
            return;
        }
        try {
            const idData = await Ids.findOne(); // 初始化
            idData[type] ++;
            await idData.save();
            return idData[type];
        }catch (err) {
            throw new Error(err);
        }
    }

    async uploadImg(req, res, next) {
        try {
            const imgPath = await this.getPath(req, res);
            console.log('得到----------------')
            console.log(imgPath)
            console.log('得到----------------')
            this.json(200, 'success', imgPath);
        } catch (err) {
            console.log('上传图片失败', err);
            res.send({
                status: 0,
                type: 'ERROR_UPLOAD_IMG',
                msg: '上传图片失败'
            })
        }
    }

    async getPath(req, res) {
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            console.log(path.join(__dirname))
            form.uploadDir = './public/images/';
            console.log('文件夹-------------')
            console.log(form.uploadDir)
            console.log('文件夹-------------')
            form.parse(req, async (err, fields, files) => {
                let img_id;
                try {
                    img_id = await this.getId('img_id');
                }catch (err) {
                    fs.unlinkSync(files.file.path); // 删除文件操作
                    reject('获取图片id失败');
                }
                const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16)
                    + img_id;
                const extName = path.extname(files.file.name);
                if (!['.jpg', '.jpeg', '.png'].includes(extName)) {
                    fs.unlinkSync(files.file.path); // 删除文件操作
                    res.send({
                        status: 0,
                        type: 'ERROR_EXTNAME',
                        msg: '文件格式错误'
                    });
                    reject('上传失败');
                    return;
                }
                const fullName = hashName + extName;
                const rePath = './public/images/' + fullName;
                console.log('图片路径-------------------')
                console.log(rePath)
                console.log('图片路径-------------------')
                try {
                    fs.renameSync(files.file.path, rePath); // 文件重命名
                    gm(rePath).resize(200, 200, '!')
                        .write(rePath, async (err) => { // 创建图片
                            resolve(fullName);
                        })
                } catch (err) {
                    console.log('保存图片失败', err);
                    if (fs.existsSync(rePath)) {
                        fs.unlinkSync(rePath);
                    } else {
                        fs.unlinkSync(files.file.path);
                    }
                    reject('保存图片失败')
                }
            })
        })
    }

    async qiniu(req, type = 'default') {
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            form.uploadDir = './public/img';
            form.parse(req, async (err, fields, files) => {
                let img_id;
                try {
                    img_id = await this.getId('img_id');
                } catch (err) {
                    console.log('获取图片id失败');
                    fs.unlinkSync(files.file.path);
                    reject('获取图片id失败')
                }
                const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16)
                    + img_id;
                const extName = path.extname(files.file.name);
                const rePath = './public/img' + hashName + extName;
                try {
                    const key = hashName + extName;
                    await fs.rename(files.file.path, rePath); // 重命名
                    const token = this.upToken('elm-server', key);
                    const qiniuImg = await this.uploadFile(token.toString(), key, rePath);
                    fs.unlinkSync(rePath);
                    resolve(qiniuImg)
                } catch (err) {
                    console.log('保存至七牛失败', err);
                    fs.unlinkSync(files.file.path);
                    reject('保存至七牛失败')
                }
            })
        })
    }

    async upToken(bucket, key) {
        let putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key);
        return putPolicy.token();
    }

    async uploadFile(upToken, key, localFile) {
        return new Promise((resolve, reject) => {
            let extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(upToken, key, localFile, extra, function (err, ret) {
                if (!err) {
                    resolve(ret.key);
                } else {
                    console.log('图片上传至七牛失败', err);
                    reject(err)
                }
            })
        })
    }

    /**
     * @param {Number} status
     * @param {String} msg
     * @param {Object} data
     */
    json(status, msg, data) {
        this.res.json({status, msg, data})
    }

    // 校验验证码是否存在
    verifyCaptcha(captcha) {
        if (!captcha) {
            return this.json(400, '验证码不能为空', {});
        }
    }
    // 校验单个参数是否存在
    verifySingleParam(param, errMsg) {
        if (!param) {
            this.json(400, errMsg, {});
            throw new Error(errMsg);
        }
    }
    // md5 3层加密
    md5(password) {
        return md5(md5(md5(password)));
    }
}

module.exports = BaseConfig;
