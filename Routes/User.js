const express = require('express');
const userRoute = express.Router();
const userController = require('../Controllers/User');

userRoute.post('/create', userController.createUser)
.get('/verify',userController.verifyUser)
.post('/edit',userController.editUser)
.post('/login',userController.loginUser)
.post('/addtocart',userController.addToCart)
.post('/removefromcart', userController.removeFromCart)
.post('/cartproductquantityset',userController.setQuantity)
.post('/addaddress',userController.addAddress)
.post('/placeorder',userController.placeOrder)
.post('/sellerShop',userController.getSellerShopData);

exports.Routes = userRoute;