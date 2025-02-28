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
