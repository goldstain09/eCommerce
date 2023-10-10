const express = require('express');
const sellerRoute = express.Router();
const sellerController = require('../Controllers/Seller');

sellerRoute.post('/follow',sellerController.followSeller);

exports.Routes = sellerRoute;