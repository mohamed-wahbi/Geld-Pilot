const express = require("express");
const router = express.Router();
const { createAuthorizationCrtl, deleteOneAuthorizationCrtl } = require ("../controllers/authorizedUserController.js")

// create one Authorization :
router.route('/create').post(createAuthorizationCrtl)


// delete one Authorization :
router.route("/delete_one/:id").delete(deleteOneAuthorizationCrtl
     
)

module.exports= router