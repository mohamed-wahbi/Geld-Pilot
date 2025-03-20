const asyncHandler = require("express-async-handler");
const { Revenue } = require("../models/RevenueModel");
const { Invoice } = require("../models/invoiceModel");
const { InvoiceHistory } = require("../models/invoiceHistoryModel");
const axios = require('axios')





// ---------------------------------Token Auto Generate-----------------------------------------

require("dotenv").config()
const { tanentId, clientId, clientSecret, url } = process.env

const getAccessToken = async () => {
    const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${tanentId}/oauth2/token`,
        new URLSearchParams({
            grant_type: "client_credentials",
            client_id: `${clientId}`,
            client_secret: `${clientSecret}`,
            resource: `${url}`
        })
    );
    return tokenResponse.data.access_token;
};

// ___________________________________________________________________________________________










/*--------------------------------------------------
* @desc    Get All revenues
* @router  /api/revenue/getAll
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getRevenuesCtrl = asyncHandler(async (req, res) => {
    const revenues = await Revenue.find({ isConfirmed: false })
    if (revenues.length === 0) {
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
module.exports.confirmeRevenueCtrl = asyncHandler(async (req, res) => {
    const revenues = await Revenue.find({ isConfirmed: false })
    if (revenues.length === 0) {
        return res.status(400).json({
            message: "No Revenues to be confirmed in the DB !"
        })
    }

    await Revenue.updateMany({ isConfirmed: false }, { $set: { isConfirmed: true } });


    res.status(200).json({
        message: "All revenue of this month are successfuly confirmed."

    })
})



/*--------------------------------------------------
* @desc    generate Monthly Revenue
* @router  /api/revenue/generate
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.generateRevCtrl = asyncHandler(async (req, res) => {
    const { year, month } = req.params;

    // 3️⃣ Obtenir un token pour Dataverse
    const token = await getAccessToken();

    try {
        const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
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




        // Étape 5: inserer les donnee au dataverse :
        const insertDataIntoDataverse = invoices.map(invoice => ({
            cr604_clientname: invoice.clientName,
            cr604_montantpaye: invoice.montantPaye,
            cr604_datepaiemententreprise: invoice.datePaiementEntreprise,
            cr604_commentairepaiement: invoice.commentairePaiement
        }));

        try {
            // Envoyer chaque objet individuellement avec `Promise.all`
            const responses = await Promise.all(
                insertDataIntoDataverse.map(data =>
                    axios.post(
                        `${url}/api/data/v9.0/cr604_revenue_gps`,
                        data,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                )
            );

        } catch (error) {
            res.status(404).json({
                message: "Erreur lors de l'insertion dans Dataverse"
            })
        }



        await InvoiceHistory.insertMany(invoicesHistory);

        // Générer les revenus mensuels
        const groupedData = invoices.reduce((acc, invoice) => {
            const key = `${year}-${month}-${invoice.id_client}`;

            if (!acc[key]) {
                acc[key] = {
                    year: `${year}`,
                    month: `${month}`,
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
            year,
            month
        });
    } catch (err) {
        console.error("Erreur lors de la génération des revenus mensuels", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});