const express = require('express');
const productRouter = express.Router();
const productsController = require('../Controllers/Products');

productRouter.get('/allProducts',productsController.getAllProducts)
.get('/oneProduct',productsController.getOneProducts);

exports.Routes = productRouter;