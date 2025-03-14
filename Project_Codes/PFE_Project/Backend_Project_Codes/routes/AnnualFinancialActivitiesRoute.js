const express = require('express');
const router = express.Router();
const { createAnnualFinancialActivityCtrl } = require ('../controllers/AnnualFinancialActivitiesController.js')


//Create 
router.route("/create").post(createAnnualFinancialActivityCtrl)



module.exports = router;