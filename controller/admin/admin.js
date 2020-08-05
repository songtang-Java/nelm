/**
 * 管理员 controller
 */
const AdminModel = require("../../database/model/admin/index");
const AddressConfig = require("../../utils/addressConfig");
const crypto = require("crypto");
const formidable = require("formidable");
const { format } = require("date-fns");
const md5 = require('md5');
const {setToken} = require('../../controller/jwt/index');
class Admin extends AddressConfig{
    constructor(req, res, next) {
        super(req, res, next);
    }

    // 注册&&登录
    async login(req, res) {
        const {username, password, captcha, status = 1} = req.body;
        try {
            this.judgeRegister(username, password);
            this.verifyCaptcha(captcha);
            const admin = await AdminModel.findOne({username});
            const savePassword = md5(md5(password));
            if (!admin) { // 未注册则登录时自动注册
                const adminTip = status == 1 ? '管理员' : '超级管理员';
                const cityInfo = await this.guessPosition(req);
                const admin_id = await this.getId('admin_id');
                const resAdmin = {
                    username,
                    password: savePassword,
                    id: admin_id,
                    admin: adminTip,
                    status,
                    city: cityInfo.city,
                    avatar: `http://${req.headers.host}/elm/images/default_avatar.jpg`,
                    online: true
                };
                const newAdmin = await AdminModel.create(resAdmin);
                req.session.admin_id = newAdmin._id;
                console.log('注册---------------')
                console.log(req.session.admin_id)
                console.log('注册---------------')
                let token = await setToken(username, newAdmin._id);
                token = "Bearer " + token;
                this.json(200, '注册管理员成功', token)
            } else if (savePassword.toString() !== admin.password.toString()) {
                console.log('管理员登录密码错误');
                this.json(400, '该用户已存在，密码输入错误', {})
            } else {
                if (captcha !== req.session.captcha) {
                    return this.json(400, '验证码错误', {});
                }
                req.session.admin_id = admin._id;
                let token = await setToken(username, admin._id);
                token = "Bearer " + token;
                this.json(200, '登录成功', token)
            }
        } catch (err) {
            console.log('登录管理员失败', err);
            this.json(400, '登录管理员失败', {})
        }
    }

    // 退出登录
    async signOut(req, res) {
        console.log('退出-------------------')
        console.log(req.user)
        console.log(req.session.admin_id)
        console.log('退出-------------------')
        try {
            if (req.user) { // 证明通过了token校验
                let token = await setToken(req.user.username, req.user._id); // 签发新的token
                if (token) {
                    this.json(200, '成功退出登录',{})
                } else {
                    this.json(301, '服务器错误，退出登录失败', {});
                }
            }
        } catch (err) {
            console.log('过期哈哈----------------')
            this.json(201, '您并没有登录，退出无效', {})
        }
        // if (req.session.admin_id) {
        //     try {
        //         req.session.destroy(err => {
        //             if (err) {
        //                 return this.json(304, 'error:' + err, {})
        //             }
        //             this.json(200, '成功退出登录',{})
        //         })
        //     } catch (err) {
        //         this.json(301, '服务器错误，退出登录失败', {});
        //     }
        // } else {
        //     console.log('过期哈哈----------------')
        //     this.json(201, '您并没有登录，退出无效', {})
        // }
    }

    // 删除管理员,只有超级管理员有权限
    async delete(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                this.json(400, '表单信息错误', {});
                return;
            }
            const {superUsername, password, targetAdmin} = fields;
            try {
                this.judgeRegister(superUsername, password);
                this.verifySingleParam(targetAdmin, '要删除的管理员不能为空');
                const superAdmin = await AdminModel.findOne({username: superUsername});
                const savePassword = md5(md5(password));
                if (superAdmin) { // 用户名正确
                    if (savePassword.toString() === superAdmin.password.toString()) { // 密码正确
                        if (superAdmin.status === 2) { // 是超级管理员
                            const targetAdminData = await AdminModel.findOneAndRemove({username: targetAdmin});
                            this.json(200, '删除成功', targetAdminData)
                        } else {
                            this.json(400, '您不是超级管理员，没有权限移除管理员', {})
                        }
                        if (superAdmin.status === 1) {
                        } else if (superAdmin.status === 2) {
                            this.json(200, '删除成功', {})
                        }
                    } else {
                        this.json(400, '您输入的密码有误', {});
                    }
                } else {
                    this.json(400, '管理员不存在', {});
                }
            } catch (err) {
                this.json(400, '删除管理员失败', {});
            }
        })
    }

    // 获取所有管理员用户
    async getAllAdmin(req, res) {
        console.log('进入----------------')
        let {page, size} = req.query;
        try {
            let resData = [];
            if (page && size) {
                page = parseInt(page);
                size = parseInt(size);
                resData = await AdminModel.find({}).sort({create_time: -1}).limit(size).skip((page - 1) * size);
            } else {
                page = 1;
                size = 10;
                resData = await AdminModel.find({});
            }
            let total = await AdminModel.countDocuments(); // 管理员总数

            this.json(200, 'success', {
                pageInfo: {
                    total,
                    page: page,
                    size,
                    totalPage: Math.ceil(total/size)
                },
                resData
            })
        } catch (err) {
            this.json(301, '查找失败', {});
        }
    }

    // 获取管理员总数
    async getAdminCount (req, res) {
        console.log('总数-------------')
        console.log()
        console.log('总数-------------')
        try {
            let total = await AdminModel.countDocuments(); // 管理员总数
            this.json(200, 'success', total);
        } catch (err) {
            console.log('获取管理员总数失败 catch err', err);
            this.json(400, '获取管理员总数失败 catch err', {});
        }
    }

    // 获取当前管理员全部信息
    async getAdminInfo(req, res) {
        const admin_id = req.session.admin_id;
        console.log('为什么呢-----------------')
        console.log(admin_id)
        console.log('为什么呢-----------------')
        this.verifySingleParam(admin_id, '管理员session失效');
        try {
            const adminInfo = await AdminModel.findOne({_id: admin_id}, '-_id -__v -password');
            console.log('为-----------------')
            console.log(adminInfo)
            console.log('为-----------------')
            this.verifySingleParam(adminInfo, '未找到当前管理员');
            this.json(200, 'success', adminInfo)
        } catch (err) {
            console.log('获取管理员信息失败 catch err', err);
            this.json(400, 'error 获取管理员信息失败', {});
        }
    }

    // 更新管理员头像
    async updateAvatar(req, res) {
        const {admin_id = ''} = req.session;
        this.verifySingleParam(admin_id, '管理员session失效');
        try {
            const image_path = await this.getPath(req);
            await AdminModel.findOneAndUpdate({id: admin_id}, {$set: {avatar: image_path}});
            this.json(200, 'success', image_path);
        } catch (err) {
            this.json(400, '上传图片失败', {});
        }
    }

    // 更新用户的上线状态
    async updateOnline (req, res) {
        const admin_id = req.session.admin_id;
        const status = req.body.status;
        try {
            const resOnline = await AdminModel.findOneAndUpdate({_id: admin_id}, {online: status});
            console.log('下线--------------')
            console.log(resOnline)
            console.log('下线--------------')
        } catch (err) {
            console.log('更新线上状态失败 catch err', err);
            this.json(400, '更新线上状态失败 catch err', {});
        }
    }

    // 判断接收的用户名密码
    judgeRegister(username, password) {
        if (!username) {
            return this.json(400, '用户名不能为空', {});
        } else if (!password) {
            return this.json(400, '密码不能为空', {})
        }
    }

}

module.exports = Admin;
