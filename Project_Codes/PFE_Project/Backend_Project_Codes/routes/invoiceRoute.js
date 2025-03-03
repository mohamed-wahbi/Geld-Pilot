const express = require('express');
const router = express.Router();
const {createInvoiceCtrl} = require('../controllers/invoiceController.js')

//Create client
router.route("/create").post(createInvoiceCtrl)

// // get all clients
// router.route("/getAll").get(getAllClientCtrl)

// // get one clients
// router.route("/getOne/:id").get(getOneClientCtrl)

// // delete one Client 
// router.route("/deleteOne/:id").delete(deleteOneClientCtrl)


// // update one Client 
// router.route("/updateOne/:id").put(updateOneClientCtrl)


module.exports = router;