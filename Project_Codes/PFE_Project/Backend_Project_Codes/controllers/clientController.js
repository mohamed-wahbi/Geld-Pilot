const asyncHandler = require("express-async-handler");
const {Client,UpdateClientValidation,CreateClientValidation} = require ("../models/clientModel.js");


/*--------------------------------------------------
* @desc    Create new client
* @router  /api/client/create
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.createClientCtrl = asyncHandler (async (req,res) => {
    // Validation
    const { error } = CreateClientValidation(req.body);
     if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    //Verifier existance de client 
    const findClient = await Client.findOne({email:req.body.email})
    if(findClient){
        return res.status(400).json({message: "One Client with this email is Arady existe!"})
    }
    // create client 
    const newClient = await Client.create(req.body)
    if(!newClient){
        return res.status(400).json({message: "Client not created!"})
    }


    res.status(201).json({ message: "Client created successfully", client: newClient });
})




/*--------------------------------------------------
* @desc    Get all clients
* @router  /api/client/get_all
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getAllClientCtrl = asyncHandler (async (req,res) => {

    const clients = await Client.find({});
    if(clients.length === 0){
        return res.status(400).json({
            message:"No clients in the DB !"
        })
    }

    res.status(200).json({
        clients
    })
})