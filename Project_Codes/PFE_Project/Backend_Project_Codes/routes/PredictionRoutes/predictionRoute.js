const express = require("express");
const router = express.Router();
const {createMonthlyFinanceCtrl,createAnnualFinanceCtrl,getAnnualFinanceCtrl,getMonthlyFinanceCtrl,createPredictionResultsCtrl} = require ('../../controllers/PredictionControllers/predictionControllers.js')


router.route('/monthly-finance/create').post(createMonthlyFinanceCtrl)
router.route('/monthly-finance/getAll').get(getMonthlyFinanceCtrl)


router.route('/annual-finance/create').post(createAnnualFinanceCtrl)
router.route('/annual-finance/getAll').get(getAnnualFinanceCtrl)



router.route('/prediction/create').get(createPredictionResultsCtrl)




module.exports= router