const asyncHandler = require("express-async-handler");
const { Client, UpdateClientValidation, CreateClientValidation } = require("../models/clientModel.js");
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
* @desc    Create new client
* @router  POST /api/client/create
* @access  only admin
----------------------------------------------------*/
module.exports.createClientCtrl = asyncHandler(async (req, res) => {
    try {
        // 1️⃣ Validation des données
        const { error } = CreateClientValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // 2️⃣ Vérifier si le client existe déjà
        const findClient = await Client.findOne({ email: req.body.email });
        if (findClient) {
            return res.status(400).json({ message: "Un client avec cet email existe déjà !" });
        }

        // 3️⃣ Obtenir un token pour Dataverse
        const token = await getAccessToken();

        // 4️⃣ Préparer et envoyer les données vers Dataverse
        const data = {
            cr604_cin: req.body.cin,
            cr604_name: req.body.name,
            cr604_email: req.body.email,
            cr604_phone: req.body.phone,
            cr604_address: req.body.address,
            cr604_clienttype: req.body.clientType,
            cr604_paymentmethod: req.body.paymentMethod,
            cr604_currency: req.body.currency,
            cr604_status: req.body.status,
        };

        const dataverseResponse = await axios.post(
            `${url}/api/data/v9.0/cr604_client_gps`,
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
        const newClient = new Client({
            cin: req.body.cin,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            clientType: req.body.clientType,
            paymentMethod: req.body.paymentMethod,
            currency: req.body.currency,
            status: req.body.status,
            dataverseId: dataverseId // Ajout de l’ID Dataverse
        });

        await newClient.save();

        // 7️⃣ Réponse finale
        res.status(201).json({
            message: "Client créé avec succès dans MongoDB et Dataverse.",
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur interne du serveur",
        });
    }
});
// _______________________________________________________________________________________________





/*--------------------------------------------------
* @desc    Get all clients
* @router  /api/client/get_all
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getAllClientCtrl = asyncHandler(async (req, res) => {

    const clients = await Client.find({});
    if (clients.length === 0) {
        return res.status(400).json({
            message: "No clients in the DB !"
        })
    }

    res.status(200).json({
        clients
    })
})


/*--------------------------------------------------
* @desc    Get one clients
* @router  /api/client/getOne/:id
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getOneClientCtrl = asyncHandler(async (req, res) => {

    const client = await Client.find({ _id: req.params.id });
    if (!client) {
        return res.status(400).json({
            message: "No clients with this id in the DB !"
        })
    }

    res.status(200).json({
        client
    })
})






/*--------------------------------------------------
* @desc    delete one clients
* @router  /api/client/deleteOne/:id
* @methode DELETE
* @access  only admin
----------------------------------------------------*/
module.exports.deleteOneClientCtrl = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ Vérifier si le client existe dans MongoDB
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé dans MongoDB." });
        }

        // 2️⃣ Vérifier si l'ID Dataverse existe
        const dataverseId = client.dataverseId;
        if (!dataverseId) {
            return res.status(400).json({ message: "ID Dataverse introuvable pour ce client." });
        }

        // 3️⃣ Obtenir un token valide pour Dataverse
        const token = await getAccessToken();

        // 4️⃣ Supprimer l'enregistrement dans Dataverse
        await axios.delete(
            `https://org712f6530.crm4.dynamics.com/api/data/v9.0/cr604_client_gps(${dataverseId})`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // 5️⃣ Supprimer l'enregistrement dans MongoDB
        await Client.findByIdAndDelete(id);

        res.status(200).json({
            message: "Client supprimé de MongoDB et Dataverse.",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur lors de la suppression.",
        });
    }
});





/*--------------------------------------------------
* @desc    Update one clients
* @router  /api/client/updateOne/:id
* @methode PUT
* @access  only admin
----------------------------------------------------*/

module.exports.updateOneClientCtrl = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ Vérifier si le client existe en MongoDB
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé dans MongoDB." });
        }

        // 2️⃣ Vérifier si l'ID Dataverse existe
        const dataverseId = client.dataverseId;
        if (!dataverseId) {
            return res.status(400).json({ message: "ID Dataverse introuvable pour ce client." });
        }

        // 3️⃣ Mettre à jour MongoDB
        const updatedClient = await Client.findByIdAndUpdate(
            id,
            {
                name: req.body.name || client.name,
                email: req.body.email || client.email,
                phone: req.body.phone || client.phone,
                address: req.body.address || client.address,

                clientType: req.body.clientType || client.clientType,
                paymentMethod: req.body.paymentMethod || client.paymentMethod,
                currency: req.body.currency || client.currency,
                status: req.body.status || client.status,
            },
            { new: true, runValidators: true } // Retourne l'objet mis à jour avec validation
        );

        // 4️⃣ Obtenir un token valide pour Dataverse
        const token = await getAccessToken();

        // 5️⃣ Mettre à jour l'entrée dans Dataverse
        const data = {
            cr604_name: req.body.name || client.name,
            cr604_email: req.body.email || client.email,
            cr604_phone: req.body.phone || client.phone,
            cr604_address: req.body.address || client.address,
            cr604_clienttype: req.body.clientType || client.clientType,
            cr604_paymentmethod: req.body.paymentMethod || client.paymentMethod,
            cr604_currency: req.body.currency || client.currency,
            cr604_status: req.body.status || client.status,
        };

        await axios.patch(
            `https://org712f6530.crm4.dynamics.com/api/data/v9.0/cr604_client_gps(${dataverseId})`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(200).json({
            message: "Client mis à jour avec succès dans MongoDB et Dataverse.",
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour.",
        });
    }
});
