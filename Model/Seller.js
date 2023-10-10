
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    ownerName:{type:String, required:true},
    shopName:{type:String,required:true},
    sellerEmail:{type:String,required:true, unique:true},
    password:{type:String,required:true},
    completedOrders:{type:[Object]},
    openOrders:{type:[Object]},
    followers:{type:[Object]},
    sellerToken:String
});

exports.Sellers = mongoose.model('Seller',sellerSchema);