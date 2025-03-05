const asyncHandler = require("express-async-handler");
const {Revenue} =  require ("../models/RevenueModel")

/*--------------------------------------------------
* @desc    Get All revenues
* @router  /api/revenue/getAll
* @methode GET
* @access  only admin
----------------------------------------------------*/
module.exports.getRevenuesCtrl = asyncHandler(async(req,res)=> {
    const revenues = await Revenue.find({})
    if(revenues.length===0){
        return res.status(400).json({
            message: "No Revenues in the DB !"
        })
    }
    res.status(200).json({
        message : "revenues featched !"
    })
})