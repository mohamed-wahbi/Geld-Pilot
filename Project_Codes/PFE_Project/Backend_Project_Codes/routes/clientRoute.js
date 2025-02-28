const express = require('express');
const router = express.Router();
const {createClientCtrl, getAllClientCtrl, getOneClientCtrl} = require('../controllers/clientController.js')

//Create client
router.route("/create").post(createClientCtrl)

// get all clients
router.route("/getAll").get(getAllClientCtrl)

// get one clients
router.route("/getOne/:id").get(getOneClientCtrl)



module.exports = router;