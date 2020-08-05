const express = require('express');
const router = express.Router();

const VipCart = require('../controller/member/vipcart');

router.post('/useCart', (req, res, next) => {
    new VipCart(req, res, next).useCart(req, res, next);
})

module.exports = router;
