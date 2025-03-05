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


module.exports = { Revenue };
