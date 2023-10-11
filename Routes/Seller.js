const express = require('express');
const sellerRoute = express.Router();
const sellerController = require('../Controllers/Seller');

sellerRoute.post('/follow',sellerController.followSeller)
.post('/unfollow',sellerController.unFollowSeller);

exports.Routes = sellerRoute;