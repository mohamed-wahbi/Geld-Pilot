const asyncHandler = require("express-async-handler");
const {ExpenseFix, CreateExpenseFixValidation, UpdateExpenseFixValidation} = require ('../models/ExpenseFixModel.js');



/*--------------------------------------------------
* @desc    Create new Expense
* @router  /api/expense-fix/create
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.createExpenseFixtCtrl = asyncHandler (async (req,res) => {
    // Validation
    const { error } = CreateExpenseFixValidation(req.body);
     if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // create client 
    const newExpenseFix = await ExpenseFix.create(req.body)
    if(!newExpenseFix){
        return res.status(400).json({message: "Expense-Fix not created!"})
    }

    res.status(201).json({ message: "Expense-Fix created successfully", ExpenseFix});
})