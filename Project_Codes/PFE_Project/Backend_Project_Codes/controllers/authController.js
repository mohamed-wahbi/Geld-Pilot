const asyncHandler = require("express-async-handler");
const { User, registerVerify, loginVerify } = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config()

const Token_Secret = process.env.Token_Secret




/*--------------------------------------------------
* @desc    Register new User
* @router  /api/auth/register
* @methode POST
* @access  Privat
----------------------------------------------------*/
module.exports.registerCtel = asyncHandler(async (req, res) => {
  // Validation
  const { error } = registerVerify(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Is user already exists
  const findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // New user and save it in DB
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone
  });
  await newUser.save();

  // Send a response to client
  res.status(201).json({ message: 'You registered successfully, please log in' });
});



/*--------------------------------------------------
* @desc    Login new User
* @router  /api/auth/login
* @methode POST
* @access  privat
----------------------------------------------------*/
module.exports.loginCtrl = asyncHandler(async (req, res) => {
  // Validation
  const { error } = loginVerify(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Find user by email
  const findEmailUser = await User.findOne({ email: req.body.email });
  if (!findEmailUser) {
    return res.status(400).json({ message: 'Email or password is invalid' });
  }

  // Password compare
  const passwordCompare = await bcrypt.compare(req.body.password, findEmailUser.password);
  if (!passwordCompare) {
    return res.status(400).json({ message: 'Email or password is invalid' });
  }

  // Genaration of the Token
  const token = jwt.sign(
    { id: findEmailUser._id,name: findEmailUser.name , isAdmin: findEmailUser.isAdmin},
    Token_Secret,
    { expiresIn: '8h' }
  );

  res.status(200).json({
    _id: findEmailUser._id,
    name: findEmailUser.name,
    phone : findEmailUser.phone,
    isAdmin: findEmailUser.isAdmin,
    profilePhoto: findEmailUser.profilePhoto,
    token
  });
  
});


