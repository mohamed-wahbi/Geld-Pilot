const mongoose = require('mongoose');
const Joi = require('joi');

const InvoiceSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    montantInitial: { type: Number, required: true },
    remise: { type: Number, default: 0, min: 0, max: 100 }, // En pourcentage
    montantApresRemise: { type: Number, default: montantInitial },
    montantPaye: { type: Number, default: 0, min: 0 },
    montantRestant: { type: Number, default: montantInitial },
    datePaiementEntreprise: { type: Date, required: true },
    datePaiementClient: { type: Date, default: null },
    statut: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
});

// Avant de sauvegarder, recalculer les montants
InvoiceSchema.pre('save', function (next) {
    this.montantApresRemise = this.montantInitial - (this.montantInitial * (this.remise / 100));
    this.montantRestant = this.montantApresRemise - this.montantPaye;
    next();
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

// Validation pour la création d'une facture
function CreateInvoiceValidation(obj) {
    const schema = Joi.object({
        id_client: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        montantInitial: Joi.number().positive().required(),
        remise: Joi.number().min(0).max(100),
        montantPaye: Joi.number().min(0),
        datePaiementEntreprise: Joi.date().required(),
        datePaiementClient: Joi.date().optional(),
        statut: Joi.string().valid('paid', 'unpaid').default('unpaid')
    });
    return schema.validate(obj);
}

// Validation pour la mise à jour d'une facture
function UpdateInvoiceValidation(obj) {
    const schema = Joi.object({
        montantInitial: Joi.number().positive(),
        remise: Joi.number().min(0).max(100),
        montantPaye: Joi.number().min(0),
        datePaiementEntreprise: Joi.date(),
        datePaiementClient: Joi.date().optional(),
        statut: Joi.string().valid('paid', 'unpaid')
    });
    return schema.validate(obj);
}

module.exports = {
    Invoice,
    CreateInvoiceValidation,
    UpdateInvoiceValidation
};
