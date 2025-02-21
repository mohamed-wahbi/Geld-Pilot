const express = require('express');
const { registerCtel, loginCtrl } = require('../controllers/authController.js');
const router = express.Router();

// register route :
router.route('/register').post(registerCtel);

//Login route :
router.route('/login').post(loginCtrl)


module.exports = router;