const express = require('express');
const router = express.Router();
const {CreateMonthlyFinancialActivitysCtrl, getAllMonthlyFinancialActivitysCtrl} = require ("../controllers/MonthlyFinancialActivitiesController.js")
//Create 
router.route("/create").post(CreateMonthlyFinancialActivitysCtrl)

//Get all 
router.route("/getAll").get(getAllMonthlyFinancialActivitysCtrl)


module.exports = router;