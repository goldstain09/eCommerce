const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId:{type:String, required:true},
    shopName:{type:String, required:true},
    productTitle:{type:String, required:true},
    productPrice:{type:Number, required:true},
    productCategory:{type:String, required:true},
    productImages:{type:[String], required:true},
    productStock:{type:Number, required:true},
    productDescription:{type:String, required:true},
    productRating:{type:Number},
});

exports.Product = mongoose.model("Product", productSchema);