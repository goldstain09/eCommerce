const model = require('../Model/User');
const Users = model.Users;
const jwt =  require('jsonwebtoken');

exports.createUser = async(req,res) => {
    const user = new Users(req.body);
    let token = jwt.sign({email:req.body.userEmail},'hhhhh');
    user.token= token;
    try {
        const createdUser = await user.save();
        res.json({token:createdUser.token});
    } catch (error) {
        res.json(error);
    }
}

exports.verifyUser = async(req,res) => {
    const token = req.get("Authorization").split('Bearer ')[1];
    // console.log(token);
    console.log('errorr');
    try {
        const decoded = jwt.verify(token, 'hhhhh');
        if(decoded.email){
            const user = await Users.findOne({userEmail:decoded.email});
            // console.log(user.userEmail);
            res.json({userName:user.userName, userEmail:user.userEmail, orders:user.orders,cart:user.cart,"authorise":true});
        }
    } catch (error) {
        res.status(401).json({"authorise":false});
    }
}