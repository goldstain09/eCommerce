const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {type:String, required:true},
    userEmail:{type:String, required:true, unique:true},
    password:{type:String, required:true, minLength:8},
    cart:{type:[Object]},
    orders:{type:[Object]},
    address:{ type: Object, default: {} },
    token:String
});

exports.Users = mongoose.model('User', userSchema);