// const { mod } = require("@tensorflow/tfjs-node");
const { AnnualFinanceTrainML } = require("../../models/PredictionsModels/AnnualFinance.js")
const { MonthlyFinanceTrainML } = require("../../models/PredictionsModels/MonthlyFinance.js")
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { PredictionResults } = require("../../models/PredictionsModels/PredictionResults.js");


/*--------------------------------------------------
* @desc    Create new MonthlyFinanc
* @router  POST /api/monthly-Financ/create
* @access  only admin
----------------------------------------------------*/
module.exports.createMonthlyFinanceCtrl = asyncHandler(async (req, res) => {
    const data = new MonthlyFinanceTrainML(req.body);
    await data.save();
    res.status(200).json({ message: "Données mensuelles ajoutées !" });
})



/*--------------------------------------------------
* @desc    Create new AnnualFinance
* @router  POST /api/Annual-Finance/create
* @access  only admin
----------------------------------------------------*/
module.exports.createAnnualFinanceCtrl = asyncHandler(async (req, res) => {
    const data = new AnnualFinanceTrainML(req.body);
    await data.save();
    res.status(200).json({ message: "Données mensuelles ajoutées !" });
})




/*--------------------------------------------------
* @desc    get  AnnualFinance
* @router  GET /api/Monthly-Finance/getAll
* @access  only admin
----------------------------------------------------*/
module.exports.getMonthlyFinanceCtrl = asyncHandler(async (req, res) => {
    const data = await MonthlyFinanceTrainML.find();
    res.json(data);
})



/*--------------------------------------------------
* @desc    get AnnualFinance
* @router  GET /api/Annual-Finance/getAll
* @access  only admin
----------------------------------------------------*/
module.exports.getAnnualFinanceCtrl = asyncHandler(async (req, res) => {
    const data = await AnnualFinanceTrainML.find();
    res.json(data);

})


module.exports.createPredictionResultsCtrl = asyncHandler(async(req,res)=> {
    try {
        const {annee,mois} = req.body

        if (!annee || !mois) {
            return res.status(400).json({ error: "L'année et le mois sont requis" });
        }

         // 1️⃣ Appel de l'API Flask avec les paramètres annee et mois
         const response = await axios.get(`http://127.0.0.1:5001/predict`, {
            params: { annee, mois }
        });

        // 2️⃣ Récupération des résultats
        const predictionData = response.data;

        // 3️⃣ Sauvegarde des prédictions dans MongoDB
        const newPrediction = new PredictionResults(predictionData);
        await newPrediction.save();

        res.json({ message: "Prédiction sauvegardée" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la prédiction" });
    }
})



















// // Route API pour la prédiction mensuelle
// module.exports.mensuellePredictionCtrl = asyncHandler(async (req, res) => {
//     const { revenu, charges, croissanceRevenu, croissanceCharges, facteurExterne } = req.body;

//     if (!revenu || !charges || !croissanceRevenu || !croissanceCharges || !facteurExterne) {
//         return res.status(400).json({ error: "Données incomplètes !" });
//     }

//     const inputData = [revenu, charges, croissanceRevenu, croissanceCharges, facteurExterne];
//     const result = await predict(inputData);

//     res.json({ message: "Prédiction mensuelle réussie", result });
// })







// module.exports.annualPredictionCtrl = asyncHandler(async (req, res) => {
//     const { revenuTotal, chargesTotal, croissanceRevenu, croissanceCharges, facteurExterne } = req.body;

//     if (!revenuTotal || !chargesTotal || !croissanceRevenu || !croissanceCharges || !facteurExterne) {
//         return res.status(400).json({ error: "Données incomplètes !" });
//     }

//     const inputData = [revenuTotal, chargesTotal, croissanceRevenu, croissanceCharges, facteurExterne];
//     const result = await predict("./models/annualModel", inputData);

//     res.json({ message: "Prédiction annuelle réussie", result });
// })