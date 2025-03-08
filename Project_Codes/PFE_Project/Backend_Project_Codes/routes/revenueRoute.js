const express = require('express');
const { getRevenuesCtrl, generateRevCtrl, confirmeRevenueCtrl } = require('../controllers/revenueController');
const router = express.Router();

router.route("/getAll").get(getRevenuesCtrl)

router.route("/generate/:annee/:mois").post(generateRevCtrl)
router.route("/confirme").post(confirmeRevenueCtrl)



module.exports = router;