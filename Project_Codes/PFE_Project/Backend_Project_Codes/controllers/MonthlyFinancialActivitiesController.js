const asyncHandler = require("express-async-handler");
const { MonthlyFinancialActivities, CreateMonthlyActivityValidation } = require("../models/MonthlyFinancialActivitiesModel.js");
const {Revenue} = require("../models/RevenueModel.js");
const {MonthlyExpenseResult} = require("../models/MonthlyExpenseResultModel.js");




/*--------------------------------------------------
* @desc    Create Monthly Financial Activities
* @route   /api/monthly-financial-activity/create
* @method  POST
* @access  only admin
----------------------------------------------------*/
module.exports.CreateMonthlyFinancialActivitysCtrl = asyncHandler(async (req, res) => {
    try {
        // 🔹 1. Validation des données d'entrée
        const { error } = CreateMonthlyActivityValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { year, month, bankFund } = req.body;

        // 🔹 2. Vérifier si une activité pour ce mois et cette année existe déjà
        const existingActivity = await MonthlyFinancialActivities.findOne({ year, month });
        if (existingActivity) {
            return res.status(400).json({ message: "L'activité financière de ce mois existe déjà." });
        }

        // 🔹 3. Récupérer les revenus et dépenses associées
        const revenueDocs = await Revenue.find();
        const totalRevenue = revenueDocs.reduce((sum, rev) => sum + (rev.montantTotalPaye || 0), 0);
        const revenuesList = revenueDocs.map((rev) => rev._id);

        const expenseDocs = await MonthlyExpenseResult.find();
        const totalExpenses = expenseDocs.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
        const expensesList = expenseDocs.map((exp) => exp._id);

        // 🔹 4. Calcul des valeurs financières
        const rest = totalRevenue - totalExpenses; // Le reste disponible après dépenses
        const globalRest = rest + bankFund; // Le reste global incluant les fonds bancaires

        // 🔹 5. Déterminer le statut financier
        let financialStatus = "Critical";
        let comment = "La situation financière est critique, aucun bénéfice.";

        if (rest > 0) {
            financialStatus = "Good";
            comment = "La situation financière est stable et rentable.";
        } else if (rest < 0) {
            financialStatus = "Bad";
            comment = "La situation financière est négative, pertes enregistrées.";
        }

        // 🔹 6. Création de l'activité financière
        const newActivity = new MonthlyFinancialActivities({
            year,
            month,
            bankFund,
            revenuesList,
            expensesList,
            totalRevenue,
            totalExpenses,
            rest: totalRevenue - totalExpenses,
            globalRest: (totalRevenue - totalExpenses) + bankFund ,
            financialStatus,
            comment,
        });

        // 🔹 7. Enregistrement dans la base de données
        await newActivity.save();

        res.status(201).json({
            message: "Activité financière créée avec succès",
            data: newActivity,
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
});




/*--------------------------------------------------
* @desc    Get All Monthly Financial Activities
* @route   /api/monthly-financial-activity/getAll
* @method  GET
* @access  only admin
----------------------------------------------------*/
module.exports.getAllMonthlyFinancialActivitysCtrl = asyncHandler(async (req, res) => {
    const getAll = await MonthlyFinancialActivities.find({})
    if (!getAll){
        return res.status(400).json({
            message: "DB is empty!"
        })
    }

    res.status(200).json({
        monthlyFinancialActivitiesData : getAll
    })
});