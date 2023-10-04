const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./Routes/User');
const productsRoute = require('./Routes/Products');

const server = express();
console.log("server started");


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://rajputsujal992:YbJuMa2wjJ155fIY@cluster0.4wvygwc.mongodb.net/ecommerce?retryWrites=true&w=majority');
  console.log('db connected');
}


server.use(cors());
server.use(express.json()); 
server.use('/user',userRoute.Routes);
server.use('/productsApi',productsRoute.Routes )




server.listen(8080);

