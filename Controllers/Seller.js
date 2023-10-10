const modelU = require("../Model/User");
const modelS = require("../Model/Seller");
const Users = modelU.Users;
const Sellers = modelS.Sellers;
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../public.key"),
  "utf-8"
);
const jwt = require("jsonwebtoken");


exports.followSeller = async (req,res)=>{
    const {userName,userId, userToken,sellerId} = req.body;
    try {
        const decoded = jwt.verify(userToken,publicKey);
        const user = await Users.findById(userId);
        const seller = await Sellers.findById(sellerId);
        if(decoded.email === user.userEmail){
            if(seller.followers.length>0){
                if(seller.followers.every((item)=>item.userId !== userId)){
                    seller.followers.push({userName:userName,userId:userId});
                    user.followingSellers.push({sellerId:sellerId});
                    await Sellers.findByIdAndUpdate(sellerId,{$set:{followers:seller.followers}});
                    await Users.findByIdAndUpdate(userId,{$set:{followingSellers:user.followingSellers}});
                    res.json({
                        followed:true
                    });
                    // yha pr merko ek kam or kranna hai ki user me ek array hai followedSellers  to usme bi seller id ye push krani hai agr phle s nhi hai isme to
                }
            }else{
                seller.followers.push({userName:userName,userId:userId});
                user.followingSellers.push({sellerId:sellerId});
                await Sellers.findByIdAndUpdate(sellerId,{$set:{followers:seller.followers}});
                await Users.findByIdAndUpdate(userId,{$set:{followingSellers:user.followingSellers}});
                res.json({
                    followed:true
                });
            }
        }else{
            res.json({
                followed:false
            });
        }
    } catch (error) {
        res.json({
            followed:false,
            someOtherError:true
        });
    }
}