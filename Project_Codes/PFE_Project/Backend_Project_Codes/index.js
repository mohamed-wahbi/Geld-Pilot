const express =require('express');
require ('./config/connect.js')
require("dotenv").config()
const app = express();
const cors = require('cors');





//middlwaere :
app.use(express.json());
app.use(cors());




// routes : 




const PORT = process.env.SERVER_PORT
app.listen(PORT,()=>console.log(`Server is active on PORT: ${PORT} *_*`))