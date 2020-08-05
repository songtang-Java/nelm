// // 专门用来配置Passport  验证jwt   配置的话，搜索passport-jwt
const JwtStrategy = require("passport-jwt/lib").Strategy,
    ExtractJwt = require("passport-jwt/lib").ExtractJwt;

const mongoose = require("mongoose");
const admin = mongoose.model("Admin");
const {secretKey} = require('../../utils/configPort');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

// 导出一个函数
module.exports = passport => {
    console.log('走啊----------------')
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        if (!jwt_payload) {
            console.log('过期----------------')
        }
        console.log('passport-----------------')
        console.log(jwt_payload);  // 保存了解析后的用户信息
        console.log('passport-----------------')
        admin.findOne({_id: jwt_payload.userId}).then( user => {
            if(user) {
                return done(null, user);
            } else {
                console.log('哇哦-----------')
                return done(null, false);
            }
        }).catch(err => console.log(err));
    }));
};
