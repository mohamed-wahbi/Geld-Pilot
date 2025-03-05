const express = require('express');
const { getRevenuesCtrl, generateRevCtrl } = require('../controllers/revenueController');
const router = express.Router();

router.route("/getAll").get(getRevenuesCtrl)

router.route("/generate/:annee/:mois").post(generateRevCtrl)



module.exports = router;