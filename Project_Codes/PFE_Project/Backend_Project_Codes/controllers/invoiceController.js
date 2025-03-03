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
        const { id_client, montantInitial, remise, montantPaye, datePaiementEntreprise } = req.body;

        // Calcul du montant après remise
        const montantApresRemise = montantInitial - (montantInitial * remise / 100);
        const montantRestant = montantApresRemise - montantPaye;

        // Déterminer le statut
        const statut = montantPaye === montantApresRemise ? "paid" : "unpaid";

        // Création de la facture
        const newInvoice = new Invoice({
            id_client,
            montantInitial,
            remise,
            montantPaye,
            datePaiementEntreprise,
            montantApresRemise,
            montantRestant,
            statut // Stocker le statut mis à jour
        });

        await newInvoice.save();
        res.status(201).json({ message: "Facture créée avec succès", invoice: newInvoice });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la facture", error: error.message });
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
* @router  /api/invoice/deleteOne
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




/*--------------------------------------------------
* @desc    Update one invoice
* @router  /api/invoice/UpdateOne
* @methode PUT
* @access  only admin
----------------------------------------------------*/
module.exports.updateOneInvoicesCtrl = asyncHandler(async (req, res) => {


    try {
        
        const updateData = req.body; // Contient uniquement les champs envoyés

        // Trouver la facture existante
        const existingInvoice = await Invoice.findById(req.params.id);
        if (!existingInvoice) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }

        // Mettre à jour uniquement les champs fournis
        if (updateData.montantInitial !== undefined) {
            existingInvoice.montantInitial = updateData.montantInitial;
        }
        if (updateData.remise !== undefined) {
            existingInvoice.remise = updateData.remise;
        }
        if (updateData.montantPaye !== undefined) {
            existingInvoice.montantPaye = updateData.montantPaye;
        }
        if (updateData.datePaiementClient !== undefined) {
            existingInvoice.datePaiementClient = updateData.datePaiementClient;
        }
        if (updateData.statut !== undefined) {
            existingInvoice.statut = updateData.statut;
        }

        // Recalculer les montants si nécessaire
        existingInvoice.montantApresRemise = existingInvoice.montantInitial - (existingInvoice.montantInitial * existingInvoice.remise / 100);
        existingInvoice.montantRestant = existingInvoice.montantApresRemise - existingInvoice.montantPaye;
        existingInvoice.statut = (updateData.montantPaye >= existingInvoice.montantApresRemise)  ? "paid" : "unpaid";
        existingInvoice.datePaiementClient = existingInvoice.updatedAt

        // Déterminer le statut

        // Sauvegarder les modifications
        const updatedInvoice = await existingInvoice.save();
        res.json(updatedInvoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});