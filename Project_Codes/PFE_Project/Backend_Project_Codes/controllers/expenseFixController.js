const asyncHandler = require("express-async-handler");
const { ExpenseFix, CreateExpenseFixValidation, UpdateExpenseFixValidation } = require('../models/ExpenseFixModel.js');



/*--------------------------------------------------
* @desc    Create new Expense
* @router  /api/expense-fix/create
* @methode POST
* @access  only admin
----------------------------------------------------*/
module.exports.createExpenseFixtCtrl = asyncHandler(async (req, res) => {
    // Validation
    const { error } = CreateExpenseFixValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // create client 
    const newExpenseFix = await ExpenseFix.create(req.body)
    if (!newExpenseFix) {
        return res.status(400).json({ message: "Expense-Fix not created!" })
    }

    res.status(201).json({ message: "Expense-Fix created successfully", ExpenseFix });
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

    const OneExpenseFix = await ExpenseFix.find({ _id: req.params.id });
    if (!OneExpenseFix) {
        return res.status(400).json({
            message: "No One Expense Fix with this id in the DB !"
        })
    }

    const deleteOneExpenseFix = await ExpenseFix.findByIdAndDelete({ _id: req.params.id })
    if (!deleteOneExpenseFix) {
        return res.status(400).json({
            message: "One Expense not deleted!"
        })
    }
    res.status(200).json({
        message: "One Expense Fix is deleted successfully."
    })
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