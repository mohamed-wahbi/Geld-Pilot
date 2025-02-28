const express = require('express');
const router = express.Router();
const {createClientCtrl, getAllClientCtrl} = require('../controllers/clientController.js')

//Create client
router.route("/create").post(createClientCtrl)

// get all clients
router.route("/getAll").get(getAllClientCtrl)

module.exports = router;