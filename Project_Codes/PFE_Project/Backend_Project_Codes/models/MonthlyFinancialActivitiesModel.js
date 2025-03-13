const mongoose = require("mongoose");
const Joi = require("joi");

// Définition du schéma MonthlyFinancialActivities
const MonthlyFinancialActivitiesSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true }, // Année de l'activité financière
    month: { type: Number, required: true, min: 1, max: 12 }, // Mois de l'activité financière (1 à 12)
    bankFund: { type: Number, required: true }, // Fonds bancaires disponibles

    // Liste des revenus et calcul du total des revenus
    totalRevenue: { type: Number, default: 0 },
    revenuesList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Revenue" }],

    // Liste des dépenses et calcul du total des dépenses
    totalExpenses: { type: Number, default: 0 },
    expensesList: [{ type: mongoose.Schema.Types.ObjectId, ref: "MonthlyExpenseResult" }],

    // Statut financier en fonction des revenus et des dépenses
    financialStatus: {
      type: String,
      enum: ["Good", "Critical", "Bad"],
      default: "Critical",
    },

    // Commentaire généré automatiquement sur la situation financière
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// Middleware pour calculer totalRevenue, totalExpenses et financialStatus avant l'enregistrement
MonthlyFinancialActivitiesSchema.pre("save", async function (next) {
  try {
    // Récupérer et calculer les revenus
    if (this.revenuesList.length > 0) {
      const revenueDocs = await mongoose.model("Revenue").find({ _id: { $in: this.revenuesList } });
      this.totalRevenue = revenueDocs.reduce((sum, rev) => sum + (rev.montantTotalPaye || 0), 0);
    } else {
      this.totalRevenue = 0;
    }

    // Récupérer et calculer les dépenses
    if (this.expensesList.length > 0) {
      const expenseDocs = await mongoose
        .model("MonthlyExpenseResult")
        .find({ _id: { $in: this.expensesList } });
      this.totalExpenses = expenseDocs.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
    } else {
      this.totalExpenses = 0;
    }

    // Déterminer le statut financier et ajouter un commentaire
    if (this.totalRevenue > this.totalExpenses) {
      this.financialStatus = "Good";
      this.comment = "Financial situation is stable and profitable.";
    } else if (this.totalRevenue === this.totalExpenses) {
      this.financialStatus = "Critical";
      this.comment = "Financial situation is critical, no profit.";
    } else {
      this.financialStatus = "Bad";
      this.comment = "Financial situation is negative, losses recorded.";
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Modèle Mongoose
const MonthlyFinancialActivities = mongoose.model(
  "MonthlyFinancialActivities",
  MonthlyFinancialActivitiesSchema
);

// Validation avec Joi pour la création d'une activité financière mensuelle
function CreateMonthlyActivityValidation(obj) {
  const schema = Joi.object({
    year: Joi.number().integer().min(2000).max(2100).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    bankFund: Joi.number().min(0).required(),
    revenuesList: Joi.array().items(Joi.string().hex().length(24)), // IDs des revenus
    expensesList: Joi.array().items(Joi.string().hex().length(24)), // IDs des dépenses
  });

  return schema.validate(obj);
}

// Validation avec Joi pour la mise à jour d'une activité financière mensuelle
function UpdateMonthlyActivityValidation(obj) {
  const schema = Joi.object({
    year: Joi.number().integer().min(2000).max(2100),
    month: Joi.number().integer().min(1).max(12),
    bankFund: Joi.number().min(0),
    totalRevenue: Joi.number().min(0),
    totalExpenses: Joi.number().min(0),
    revenuesList: Joi.array().items(Joi.string().hex().length(24)),
    expensesList: Joi.array().items(Joi.string().hex().length(24)),
  }).min(1); // Au moins un champ doit être mis à jour

  return schema.validate(obj);
}

module.exports = {
  MonthlyFinancialActivities,
  CreateMonthlyActivityValidation,
  UpdateMonthlyActivityValidation,
};
