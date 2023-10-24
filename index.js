const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoute = require('./Routes/User');
const productsRoute = require('./Routes/Products');
const sellerRoute = require('./Routes/Seller');
require('dotenv').config();

const server = express();
// console.log("server started");


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO);
  // console.log('db connected');
}


server.use(cors());
server.use(express.json()); 
server.use(express.static(process.env.STATIC));
server.use('/user',userRoute.Routes);
server.use('/productsApi',productsRoute.Routes);
server.use('/seller',sellerRoute.Routes);
server.use('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'build', 'index.html'));
})




server.listen(process.env.PORT || 8080);

