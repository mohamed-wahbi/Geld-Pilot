const asyncHandler = require("express-async-handler");
const {Revenue} =  require ("../models/RevenueModel");
const { Invoice } = require("../models/invoiceModel");
const { InvoiceHistory } = require("../models/invoiceHistoryModel");

/*--------------------------------------------------
* @desc    Get All revenues
* @router  /api/revenue/getAll
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getRevenuesCtrl = asyncHandler(async(req,res)=> {
    const revenues = await Revenue.find({isConfirmed: false})
    if(revenues.length===0){
        return res.status(400).json({
            message: "No Revenues in the DB !"
        })
    }

    res.status(200).json({
        revenues,
        
    })
})


/*--------------------------------------------------
* @desc    Confirmed Monthly revenues
* @router  /api/revenue/confirme
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.confirmeRevenueCtrl = asyncHandler(async(req,res)=> {
    const revenues = await Revenue.find({isConfirmed: false})
    if(revenues.length===0){
        return res.status(400).json({
            message: "No Revenues to be confirmed in the DB !"
        })
    }

    await Revenue.updateMany({ isConfirmed: false }, { $set: { isConfirmed: true } });


    res.status(200).json({
        message : "All revenue of this month are successfuly confirmed."
        
    })
})



/*--------------------------------------------------
* @desc    generate Monthly Revenue
* @router  /api/revenue/generate
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.generateRevCtrl = asyncHandler(async (req, res) => {
    const { annee, mois } = req.params;

    try {
        const startDate = new Date(`${annee}-${mois}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const invoices = await Invoice.find({
            statut: 'discharged',
            datePaiementEntreprise: { $gte: startDate, $lt: endDate }
        });

        if (invoices.length === 0) {
            return res.status(400).json({ message: "No paid invoices found for this period!" });
        }

        // Stocker les factures dans InvoiceHistory
        const invoicesHistory = invoices.map(invoice => ({
            id_invoice: invoice._id,
            id_client: invoice.id_client,
            clientName: invoice.clientName,
            montantInitial: invoice.montantInitial,
            remise: invoice.remise,
            montantApresRemise: invoice.montantApresRemise,
            montantPaye: invoice.montantPaye,
            datePaiementEntreprise: invoice.datePaiementEntreprise,
            datePaiementClient: invoice.datePaiementClient,
            commentairePaiement: invoice.commentairePaiement,
            statut: invoice.statut,
        }));

        await InvoiceHistory.insertMany(invoicesHistory);

        // Générer les revenus mensuels
        const groupedData = invoices.reduce((acc, invoice) => {
            const key = `${annee}-${mois}-${invoice.id_client}`;

            if (!acc[key]) {
                acc[key] = {
                    annee: `${annee}`,
                    mois: `${mois}`,
                    id_client: invoice.id_client,
                    nomClient: invoice.clientName,
                    nombreFacturesPayees: 0,
                    montantTotalPaye: 0,
                };
            }

            acc[key].nombreFacturesPayees += 1;
            acc[key].montantTotalPaye += invoice.montantPaye;

            return acc;
        }, {});

        const revenues = Object.values(groupedData);
        await Revenue.insertMany(revenues);

        // Supprimer les factures archivées du modèle Invoice
        await Invoice.deleteMany({ statut: 'discharged', datePaiementEntreprise: { $gte: startDate, $lt: endDate } });

        res.status(200).json({
            message: "Revenue generated and invoices archived successfully.",
            annee,
            mois
        });
    } catch (err) {
        console.error("Erreur lors de la génération des revenus mensuels", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});