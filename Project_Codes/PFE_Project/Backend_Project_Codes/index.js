const express =require('express');
require ('./config/connect.js')
require("dotenv").config()
const app = express();
const cors = require('cors');

// Imported Routes :
const authRoutes = require('./routes/authRoute.js');
const authorizationUserRoutes = require('./routes/authorizedUserRoute.js');
const clientRoutes = require('./routes/clientRoute.js');
const expenseFixRoutes = require('./routes/expenseFixRoute.js');



//middlwaere :
app.use(express.json());
app.use(cors());




// Path routes : 
app.use('/api/auth',authRoutes);
app.use('/api/authorization',authorizationUserRoutes);
app.use('/api/client',clientRoutes);
app.use('/api/expense-fix',expenseFixRoutes);





const PORT = process.env.SERVER_PORT
app.listen(PORT,()=>console.log(`Server is active on PORT: ${PORT} *_*`))