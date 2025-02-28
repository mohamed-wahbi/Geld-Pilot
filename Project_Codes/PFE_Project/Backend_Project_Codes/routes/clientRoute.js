const express = require('express');
const router = express.Router();
const {createClientCtrl} = require('../controllers/clientController.js')

router.route("/create").post(createClientCtrl)

module.exports = router;