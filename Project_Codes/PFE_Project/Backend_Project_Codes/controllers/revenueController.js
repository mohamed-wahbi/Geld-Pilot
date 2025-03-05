const asyncHandler = require("express-async-handler");
const {Revenue} =  require ("../models/RevenueModel");
const { Invoice } = require("../models/invoiceModel");

/*--------------------------------------------------
* @desc    Get All revenues
* @router  /api/revenue/getAll
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getRevenuesCtrl = asyncHandler(async(req,res)=> {
    const revenues = await Revenue.find({})
    if(revenues.length===0){
        return res.status(400).json({
            message: "No Revenues in the DB !"
        })
    }
    res.status(200).json({
        revenues
    })
})



/*--------------------------------------------------
* @desc    generate Monthly Revenue
* @router  /api/revenue/generate
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.generateRevCtrl = asyncHandler(async(req,res) => {

    const {annee, mois} = req.params

    try {
        const startDate = new Date(`${annee}-${mois}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const invoices = await Invoice.find({
            statut: 'discharged',
            datePaiementEntreprise: { $gte: startDate, $lt: endDate }
        });

        const groupedData = invoices.reduce((acc, invoice) => {
            const key = `${annee}-${mois}-${invoice.id_client}`;

            if (!acc[key]) {
                acc[key] = {
                    annee:`${annee}`,
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
        res.status(200).json({
            message: "Revenue Generated successfuly .",
            annee,
            mois
        })
    } catch (err) {
        console.error("Erreur lors de la génération des revenus mensuels", err);
    }

   

})