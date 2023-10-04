const model = require('../Model/Products');
const Products = model.Product;


exports.getAllProducts = async(req,res) => {
    try {
        const allProducts = await Products.find();
        if(allProducts){
            res.json({data:allProducts, DataFound:true});
        }else{
            res.json({DataFound:false});
        }
    } catch (error) {
        res.json({DataFound:false});
    }
}

exports.getOneProducts = async(req,res) => {
    try {
        if(req.query.id){
            const thatOneProduct = await Products.findById(req.query.id);
            if(thatOneProduct){
                res.json({data:thatOneProduct, DataFound:true});
            }else{
                res.json({DataFound:false});
            }
        }
    } catch (error) {
        res.json({DataFound:false});
    }
}