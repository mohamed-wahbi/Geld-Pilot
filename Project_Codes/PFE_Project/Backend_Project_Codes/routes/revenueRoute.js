const express = require('express');
const { getRevenuesCtrl } = require('../controllers/revenueController');
const router = express.Router();

router.route("/getAll").get(getRevenuesCtrl)


module.exports = router;