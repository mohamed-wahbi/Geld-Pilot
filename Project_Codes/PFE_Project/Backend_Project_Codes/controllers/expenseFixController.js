const asyncHandler = require("express-async-handler");
const { ExpenseFix, CreateExpenseFixValidation, UpdateExpenseFixValidation } = require('../models/ExpenseFixModel.js');
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
* @desc    Create new Expense
* @router  /api/expense-fix/create
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.createExpenseFixtCtrl = asyncHandler(async (req, res) => {
    try {
            // 1️⃣ Validation des données
            const { error } = CreateExpenseFixValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
    
    
            // 3️⃣ Obtenir un token pour Dataverse
            const token = await getAccessToken();
    
            // 4️⃣ Préparer et envoyer les données vers Dataverse
            const data = {
                cr604_expensename: req.body.expenseName,
                cr604_expensetype: req.body.expenseType,
                cr604_amount: req.body.amount,
                cr604_status: req.body.status,
            };
    
            const dataverseResponse = await axios.post(
                `${url}/api/data/v9.0/cr604_expensefix_gps`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // 5️⃣ Extraire l'ID de Dataverse depuis l'en-tête `location`
            const locationHeader = dataverseResponse.headers.location;
            if (!locationHeader) {
                return res.status(500).json({ message: "Client créé sur Dataverse, mais impossible de récupérer son ID." });
            }
            const dataverseId = locationHeader.match(/\((.*?)\)/)[1];
    
            // 6️⃣ Enregistrer le client dans MongoDB
            const newCharge = new ExpenseFix({
                expenseName: req.body.expenseName,
                expenseType: req.body.expenseType,
                amount: req.body.amount,
                status: req.body.status,
                paymentDay: req.body.paymentDay,
                dataverseId: dataverseId // Ajout de l’ID Dataverse
            });
    
            await newCharge.save();
    
            // 7️⃣ Réponse finale
            res.status(201).json({
                message: "Charge créé avec succès dans MongoDB et Dataverse.",
            });
    
        } catch (error) {
            res.status(500).json({
                message: "Erreur interne du serveur",
            });
        }

 })


/*--------------------------------------------------
* @desc    GET All ExpenseFix
* @router  /api/expense-fix/get_app
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getAllExpenseFixCtrl = asyncHandler(async (req, res) => {

    const expensesFixs = await ExpenseFix.find({});
    if (expensesFixs.length === 0) {
        return res.status(400).json({
            message: "No Expenses Fixs in the DB !"
        })
    }

    res.status(200).json({
        Expenses_Fixs: expensesFixs
    })
})


/*--------------------------------------------------
* @desc    GET All ExpenseFix
* @router  /api/expense-fix/get_app
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getManyExpenseFixCtrl = asyncHandler(async (req, res) => {

    try {
        let ids = req.query.ids; // Récupération de la liste des _id depuis la requête
        if (!ids) {
            return res.status(400).json({ message: "Aucun ID fourni" });
        }
        
        ids = ids.split(','); // Convertir la chaîne en tableau

        const clients = await ExpenseFix.find({ _id: { $in: ids } });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    
})



/*--------------------------------------------------
* @desc    Get one ExpenseFix
* @router  /api/expense-fix/getOne/:id
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getOneExpenseFixCtrl = asyncHandler(async (req, res) => {

    const oneExpenseFix = await ExpenseFix.find({ _id: req.params.id });
    if (!oneExpenseFix) {
        return res.status(400).json({
            message: "No Expense-Fix with this id in the DB !"
        })
    }

    res.status(200).json({
        oneExpenseFix
    })
})



/*--------------------------------------------------
* @desc    delete one ExpneseFix
* @router  /api/expense-fix/deleteOne/:id
* @methode DELETE
* @access  only admin
----------------------------------------------------*/
module.exports.deleteOneExpenseFixCtrl = asyncHandler(async (req, res) => {



    try {
            const { id } = req.params;
    
            // 1️⃣ Vérifier si le charge existe dans MongoDB
            const charge = await ExpenseFix.findById(id);
            if (!charge) {
                return res.status(404).json({ message: "Charge non trouvé dans MongoDB." });
            }
    
            // 2️⃣ Vérifier si l'ID Dataverse existe
            const dataverseId = charge.dataverseId;
            if (!dataverseId) {
                return res.status(400).json({ message: "ID Dataverse introuvable pour ce charge." });
            }
    
            // 3️⃣ Obtenir un token valide pour Dataverse
            const token = await getAccessToken();
    
            // 4️⃣ Supprimer l'enregistrement dans Dataverse
            await axios.delete(
                `https://org712f6530.crm4.dynamics.com/api/data/v9.0/cr604_expensefix_gps(${dataverseId})`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // 5️⃣ Supprimer l'enregistrement dans MongoDB
            await ExpenseFix.findByIdAndDelete(id);
    
            res.status(200).json({
                message: "Charge supprimé de MongoDB et Dataverse.",
            });
    
        } catch (error) {
            return res.status(500).json({
                message: "Erreur lors de la suppression.",
            });
        }








    // const OneExpenseFix = await ExpenseFix.find({ _id: req.params.id });
    // if (!OneExpenseFix) {
    //     return res.status(400).json({
    //         message: "No One Expense Fix with this id in the DB !"
    //     })
    // }

    // const deleteOneExpenseFix = await ExpenseFix.findByIdAndDelete({ _id: req.params.id })
    // if (!deleteOneExpenseFix) {
    //     return res.status(400).json({
    //         message: "One Expense not deleted!"
    //     })
    // }
    // res.status(200).json({
    //     message: "One Expense Fix is deleted successfully."
    // })
})





/*--------------------------------------------------
* @desc    Update one Expense Fix
* @router  /api/expense-fix/updateOne/:id
* @methode PUT
* @access  only admin
----------------------------------------------------*/
module.exports.updateOneExpenseFixCtrl = asyncHandler(async (req, res) => {

    // Validation
    const { error } = UpdateExpenseFixValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const oneExpenseFix = await ExpenseFix.find({ _id: req.params.id });
    if (!oneExpenseFix) {
        return res.status(400).json({
            message: "No Expense Fix with this id in the DB !"
        })
    }


    const updatedOneExpenseFix = await ExpenseFix.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        message: "Client has been updated successfully.",

    });


})