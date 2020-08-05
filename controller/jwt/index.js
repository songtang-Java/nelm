const jwt = require('jsonwebtoken');
const {secretKey} = require('../../utils/configPort');

// 生成token
function setToken(username, userId) {
    return jwt.sign({username, userId}, secretKey, {expiresIn: 60*5});
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ').pop(); //获取请求头的信息
    jwt.verify(token,secretKey,(error,decoded)=>{
        if(error){
            res.json({
                status: 401,
                msg: 'token失效'
            })
        }
        console.log("校验",decoded)
    });
    console.log('验证是否过期------------------')
    console.log(token)
    console.log('验证是否过期------------------')
    next();
}

module.exports = {
    setToken, verifyToken
};
