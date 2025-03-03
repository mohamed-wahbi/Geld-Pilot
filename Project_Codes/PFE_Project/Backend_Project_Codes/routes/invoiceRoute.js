const express = require('express');
const router = express.Router();
const {createInvoiceCtrl, getAllInvoicesCtrl} = require('../controllers/invoiceController.js')

//Create invoice
router.route("/create").post(createInvoiceCtrl)

// get all invoices
router.route("/getAll").get(getAllInvoicesCtrl)

// // get one clients
// router.route("/getOne/:id").get(getOneClientCtrl)

// // delete one Client 
// router.route("/deleteOne/:id").delete(deleteOneClientCtrl)


// // update one Client 
// router.route("/updateOne/:id").put(updateOneClientCtrl)


module.exports = router;