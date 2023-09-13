const express = require('express');
const userRoute = express.Router();
const userController = require('../Controllers/User');

userRoute.post('/create', userController.createUser)
.get('/verify',userController.verifyUser);

exports.UserRoute = userRoute;