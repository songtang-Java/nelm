const formidable = require('formidable');
const UserInfoModel = require('../../database/model/v2/userInfo');
const UserModel = require('../../database/model/v2/user');
const AddressConfig = require('../../utils/addressConfig');
const md5 = require("md5");
const {format}  = require('date-fns');

class User extends AddressConfig {
    constructor(req, res, next) {
        super(req, res, next);
    }

    // 用户登录
    async login(req, res, next) {
        const cap = req.session.captcha;
        this.verifySingleParam(cap, '验证码失效');
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {username, password, captcha} = fields;
            try {
                this.verifySingleParam(username, '用户名参数错误');
                this.verifySingleParam(password, '密码参数错误');
                this.verifySingleParam(captcha, '验证码参数错误');
            } catch (err) {
                console.log('登陆参数错误 catch error' + err);
                return this.json(400, '登陆参数错误', {});
            }
            if (cap.toString() !== captcha.toString()) {
                return this.json(400, '验证码不正确', {});
            }
            const md5Password = md5(md5(md5(password)));
            try {
                const user = await UserModel.findOne({username});
                if (!user) {
                    const userId = await this.getId('user_id');
                    console.log('wocao----------------')
                    console.log(userId)
                    console.log('wocao----------------')
                    const cityInfo = await this.guessPosition(req);
                    const newUser = {username, password: md5Password, userId};
                    const newUserInfo = {username, userId, id: userId, city: cityInfo.city,
                        avatar: `http://${req.headers.host}/public/images/default_avatar.jpg`};
                    UserModel.create(newUser);
                    const createNewUserInfo = new UserInfoModel(newUserInfo);
                    const userInfo = await createNewUserInfo.save();
                    req.session.userId = userId;
                    this.json(200, '创建用户成功', userInfo);
                } else if (user.password.toString() !== md5Password.toString()) {
                    return this.json(400, '密码错误', {})
                } else {
                    req.session.userId = user.userId;
                    const userInfo = await UserInfoModel.findOne({userId: user.userId}, '_id');
                    this.json(200, '登录成功', userInfo);
                }
            } catch (err) {
                this.json(400, '登录失败' + err, {});
            }
        })
    }

    //查找当前用户信息
    async getUserInfo(req, res, next) {
        const sid = req.session.userId;
        const qid = req.query.userId;
        const userId = sid || qid;
        this.verifySingleParam(+userId, '未登录，请重新登录！');
        try {
            const userInfo = await UserInfoModel.findOne({userId});
            this.json(200, 'success', userInfo);
        } catch (err) {
            console.log('通过session获取用户信息失败 catch err' + err);
            this.json(400, '通过session获取用户信息失败 catch err', {});
        }
    }

    // 根据id查找用户信息
    async getUserById(req, res, next) {
        let userId = req.query.userId;
        this.verifySingleParam(userId, '获取用户ID失败');
        try {
            const userInfo = await UserInfoModel.findOne({userId});
            this.json(200, 'success', userInfo);
        } catch (err) {
            console.error('通过用户ID获取用户信息失败' + err);
            this.json(400, '通过用户ID获取用户信息失败' + err, {});
        }
    }

    // 退出登录
    async signOut(req, res, next) {
        delete req.session.userId;
        this.json(200, '退出成功', {});
    }

    // 更改密码
    async changePassword (req, res, next) {
        const cap = req.cookies.cap;
        this.verifySingleParam(cap, '验证码失效');
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {username, oldPassword, newPassword, confirmPwd, captchaCode} = fields;
            try {
                this.verifySingleParam(username, '用户名参数错误');
                this.verifySingleParam(oldPassword, '必须添加旧密码');
                this.verifySingleParam(newPassword, '必须填写新密码');
                this.verifySingleParam(confirmPwd, '必须填写确认密码');
                this.verifySingleParam(captchaCode, '请填写验证码');
                if (newPassword !== confirmPwd) {
                    return this.json(400, '两次密码不一致', {});
                } else if (cap.toString() !== captchaCode.toString()) {
                    return this.json(400, '验证码不正确', {});
                }
                const md5Password = md5(md5(md5(oldPassword)));
                const user = await UserModel.findOne({username});
                this.verifySingleParam(user, '未找到当前用户');
                if (user.password.toString() !== md5Password.toString()) {
                    this.json(400, '密码错误', {});
                } else {
                    user.password = this.md5(newPassword);
                    user.save();
                    this.json(200, '密码修改成功', {});
                }
             } catch (err) {
                console.log('修改密码失败' + err);
                this.json(400, '修改密码失败 catch err', {})
            }
        })
    }

    // 获取用户列表数据
    async getUserList (req, res, next) {
        const {page = 1, size = 10} = req.query;
        try {
            const users = await UserInfoModel.find({}, '-_id').sort({create_time: -1}).limit(Number(size)).skip((page - 1)*size);
            const total = await UserModel.countDocuments();
            this.json(200, 'success', {
                pageInfo: {
                    total,
                    page,
                    size,
                    totalPage: Math.ceil(total/size)
                },
                users
            });
        } catch (err) {
            console.log('获取用户列表数据失败' + err);
            this.json(400, '获取用户列表数据失败 getUserList catch err', {});
        }
    }

    // 获取用户总数
    async getUserCount (req, res, next) {
        try {
            const count = await UserInfoModel.countDocuments();
            this.json(200, 'success', count);
        } catch (err) {
            console.log('获取用户数量失败', err);
            this.json(400, '获取用户数量失败 getUserCount catch err', {});
        }
    }

    // 更新用户头像
    async updateAvatar (req, res, next) {
        const sid = req.session.userId;
        const bid = req.body.userId;
        const userId = sid || bid;
        this.verifySingleParam(userId, '更新头像，userId获取失败，请重新登录');
        try {
            const imagePath = await this.getPath(req);
            await UserInfoModel.findOneAndUpdate({userId}, {$set: {avatar: imagePath}});
            this.json(200, 'success', imagePath);
        } catch (err) {
            console.log('上传图片失败', err);
            this.json(400, '上传图片失败 catch err', {});
        }
    }

    // 获取用户城市
    async getUserCity (req, res, next) {
        const cityArr = ['北京', '上海', '深圳', '杭州'];
        const filterArr = [];
        cityArr.forEach(item => {
            filterArr.push(UserInfoModel.find({city: item}).count());
        });
        filterArr.push(UserInfoModel.$where('!"北京上海深圳杭州".includes(this.city)').count());
        Promise.all(filterArr).then(res => {
            this.json(200, 'success', {
                beijing: res[0],
                shanghai: res[1],
                shenzhen: res[2],
                hangzhou: res[3],
                qita: res[4]
            })
        }).catch(err => {
            console.log('获取用户分布城市数据失败' , err);
            this.json(400, '获取用户分布城市数据失败 getUserCity catch err', {});
        })
    }
}

module.exports = User;
