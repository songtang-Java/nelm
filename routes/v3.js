const express = require('express');
const router = express.Router();
const Explain = require('../controller/v3/explain');

router.get('/',  (req, res, next) => {
    new Explain(req, res, next).getExpalin(req, res, next);
});

module.exports = router;
