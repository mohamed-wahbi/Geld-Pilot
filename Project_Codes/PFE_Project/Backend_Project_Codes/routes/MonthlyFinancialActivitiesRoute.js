const express = require('express');
const router = express.Router();
const {CreateMonthlyFinancialActivitysCtrl, getAllMonthlyFinancialActivitysCtrl,getLatestMonthlyFinancialActivityCtrl} = require ("../controllers/MonthlyFinancialActivitiesController.js")
//Create 
router.route("/create").post(CreateMonthlyFinancialActivitysCtrl)

//Get all 
router.route("/getAll").get(getAllMonthlyFinancialActivitysCtrl)

//Get latest
router.route("/latest").get(getLatestMonthlyFinancialActivityCtrl)


module.exports = router;