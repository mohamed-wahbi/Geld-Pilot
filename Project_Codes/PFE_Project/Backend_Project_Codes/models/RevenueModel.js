const mongoose = require('mongoose');
const { Invoice } = require('../models/invoiceModel.js');
const { types, required } = require('joi');

const RevenueSchema = new mongoose.Schema({
    annee: { type: String, required: true },
    mois: { type: String, required: true },
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    nomClient: { type: String, required: true },
    nombreFacturesPayees: { type: Number, default: 0 },
    montantTotalPaye: { type: Number, default: 0 },
}, {
    timestamps: true
});

const Revenue = mongoose.model("Revenue", RevenueSchema);

// Récupérer tous les revenus
async function getAllRevenues(req, res) {
    try {
        const revenues = await Revenue.find();
        res.json(revenues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Générer les revenus mensuels pour une année et un mois spécifiques
async function generateMonthlyRevenue(annee, mois) {
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
        console.log(`Revenus générés avec succès pour ${annee}-${mois}`);
    } catch (err) {
        console.error("Erreur lors de la génération des revenus mensuels", err);
    }
}

module.exports = { Revenue, getAllRevenues, generateMonthlyRevenue };
