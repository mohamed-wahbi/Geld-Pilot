const express = require('express');
const router = express.Router();
const {createClientCtrl, getAllClientCtrl, getOneClientCtrl, deleteOneClientCtrl} = require('../controllers/clientController.js')

//Create client
router.route("/create").post(createClientCtrl)

// get all clients
router.route("/getAll").get(getAllClientCtrl)

// get one clients
router.route("/getOne/:id").get(getOneClientCtrl)

// delete one Client 
router.route("/deleteOne/:id").delete(deleteOneClientCtrl)


module.exports = router;