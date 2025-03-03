const asyncHandler = require("express-async-handler");
const { Invoice, CreateInvoiceValidation } = require ("../models/invoiceModel.js");

/*--------------------------------------------------
* @desc    Create new Invoice
* @router  /api/invoice/create
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.createInvoiceCtrl = asyncHandler(async (req, res) => {
    // Validation
    const { error } = CreateInvoiceValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Création de la facture
        const invoice =  Invoice.create({
            id_client: req.body.id_client,
            montantInitial: req.body.montantInitial,
            remise: req.body.remise || 0,
            montantPaye: req.body.montantPaye || 0,
            datePaiementEntreprise: req.body.datePaiementEntreprise,
            datePaiementClient: req.body.datePaiementClient,
            statut: req.body.statut || 'unpaid'
        });

        res.status(201).json({
            message: "Invoice created successfully."
        });
    } catch (err) {
        res.status(500).json({ message: "Server error, invoice not created.", error: err.message });
    }
});




/*--------------------------------------------------
* @desc    Get all invoices
* @router  /api/invoice/get_all
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getAllInvoicesCtrl = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({}).populate('id_client',["name"]);

    if (invoices.length === 0) {
        return res.status(400).json({
            message: "No invoices in the DB!"
        });
    }

    res.status(200).json({
        invoices
    });
});




/*--------------------------------------------------
* @desc    Delete one invoice
* @router  /api/invoice/deleteOneall
* @methode DELETE
* @access  only admin
----------------------------------------------------*/
module.exports.deleteOneInvoicesCtrl = asyncHandler(async (req, res) => {

    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Facture supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
});