
function authAdmin(req, res, next) {
    if(req.session && req.session.admin_id){
        next()
    }else{
        console.log('过期了--------------')
        res.json({
            status: 403,
            msg: '登录状态过期！',
        })
    }
}
module.exports = {
    authAdmin,
};
