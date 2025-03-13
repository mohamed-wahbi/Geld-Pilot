const express = require('express');
const router = express.Router();
const {CreateMonthlyFinancialActivitysCtrl} = require ("../controllers/MonthlyFinancialActivitiesController.js")
//Create invoice
router.route("/create").post(CreateMonthlyFinancialActivitysCtrl)


module.exports = router;