const express = require("express");
const router = express.Router();

const RedEnvelope = require("../controller/promotion/redPaper");

router.get('/getredenvelope', (req, res, next) => {
    new RedEnvelope(req, res, next).getRedEnvelope(req, res, next);
});

router.get('/getexpiredenvelope', (req, res, next) => {
    new RedEnvelope(req, res, next).getExpiredRedEnvelope(req, res, next);
});

module.exports = router;
