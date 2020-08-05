const express = require('express');
const router = express.Router();

const CityHandle = require('../controller/v1/cities');
const EntryHandle = require('../controller/v2/entry');
const User = require("../controller/v2/user");
const date = require('../initData/date');


router.get('/position/:geohash', (req, res, next) => {
   new CityHandle(req, res, next).searchPosition(req, res, next);
});

router.get('/getEntry', (req, res, next) => {
   new EntryHandle(req, res, next).getEntry(req, res, next);
});

router.get('/test', (req, res, next) => {
   res.json({
      status: 200,
      msg: 'success',
      data: date
   })
})

module.exports = router;
