const modelU = require("../Model/User");
const modelS = require("../Model/Seller");
const modelP = require("../Model/Products");
// const fs = require("fs");
// const path = require("path");
// const privateKey = fs.readFileSync(
//   path.resolve(__dirname, "../private.key"),
//   "utf-8"
// );
// const publicKey = fs.readFileSync(
//   path.resolve(__dirname, "../public.key"),
//   "utf-8"
// );
require("dotenv").config();
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

const Users = modelU.Users;
const Sellers = modelS.Sellers;
const Products = modelP.Product;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const user = new Users(req.body);
  let token = jwt.sign({ email: req.body.userEmail }, privateKey, {
    algorithm: "RS256",
  });
  user.address = {};
  // console.log(user);
  user.token = token;
  const hash = bcrypt.hashSync(req.body.password, 10);
  user.password = hash;
  try {
    const createdUser = await user.save();
    res.json({
      token: createdUser.token,
      userName: user.userName,
      userEmail: user.userEmail,
      orders: user.orders,
      cart: user.cart,
      id: user._id,
      authorise: true,
      address: user.address,
      followingSellers: user.followingSellers,
      accountCreated: true,
    });
  } catch (error) {
    res.json(error);
  }
};

exports.verifyUser = async (req, res) => {
  const token = req.get("Authorization").split("Bearer ")[1];
  // console.log(token);
  try {
    const decoded = jwt.verify(token, publicKey);
    if (decoded.email) {
      const user = await Users.findOne({ userEmail: decoded.email });
      // console.log(user.userEmail);
      res.json({
        userName: user.userName,
        userEmail: user.userEmail,
        orders: user.orders,
        cart: user.cart,
        id: user._id,
        authorise: true,
        address: user.address,
        followingSellers: user.followingSellers,
        verifieddANDLoggedIn: true,
      });
    }
  } catch (error) {
    res.json({ authorise: false }).status(401);
  }
};

exports.loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  const user = await Users.findOne({ userEmail: userEmail });
  if (user !== null) {
    let token = jwt.sign({ email: userEmail }, privateKey, {
      algorithm: "RS256",
    });
    if (bcrypt.compareSync(password, user.password)) {
      res.json({
        token: token,
        authorise: true,
        userName: user.userName,
        userEmail: user.userEmail,
        orders: user.orders,
        cart: user.cart,
        id: user._id,
        address: user.address,
        followingSellers: user.followingSellers,
        LoggedIn: true,
      });
      user.token = token;
      await user.save();
    } else {
      res.json({ authorise: false });
    }
  } else {
    res.json({ authorise: false });
  }

  // const token = req.get("Authorization").split("Bearer ")[1];
  // bcrypt.compareSync(myPlaintextPassword, hash);
};

exports.editUser = async (req, res) => {
  const { userEmail, password, userName, token } = req.body;
  try {
    const decoded = jwt.verify(token, publicKey);
    if (decoded.email) {
      const user = await Users.findOne({ userEmail: decoded.email });
      // console.log(user);
      if (bcrypt.compareSync(password, user.password)) {
        let newEmailtoken = jwt.sign({ email: userEmail }, privateKey, {
          algorithm: "RS256",
        });
        user.token = newEmailtoken;
        user.userEmail = userEmail;
        user.userName = userName;
        await user.save();
        console.log(user);
        res.json({
          token: newEmailtoken,
          authorise: true,
          userName: user.userName,
          userEmail: user.userEmail,
          orders: user.orders,
          cart: user.cart,
          id: user._id,
          address: user.address,
          followingSellers: user.followingSellers,
        });
      } else {
        res.json({ authorise: false });
      }
    }
  } catch (error) {
    res.json({ authorise: false });
  }
};

// user add to cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity, userToken } = req.body;
  try {
    const decoded = jwt.verify(userToken, publicKey);
    const user = await Users.findById(userId);
    if (decoded.email === user.userEmail) {
      if (user.cart.length > 0) {
        if (user.cart.every((item) => item.productId !== productId)) {
          user.cart.push({ productId: productId, quantity: quantity });
          await user.save();
          res.json({
            userName: user.userName,
            userEmail: user.userEmail,
            orders: user.orders,
            cart: user.cart,
            id: user._id,
            address: user.address,
            followingSellers: user.followingSellers,
            authorise: true,
            added: true,
          });
        } else {
          res.json({ added: false, alreadyInCart: true });
        }
      } else {
        user.cart.push({ productId: productId, quantity: quantity });
        await user.save();
        res.json({
          userName: user.userName,
          userEmail: user.userEmail,
          orders: user.orders,
          cart: user.cart,
          id: user._id,
          address: user.address,
          followingSellers: user.followingSellers,
          authorise: true,
          added: true,
        });
      }
    }
  } catch (error) {
    res.json({ added: false, someOtherError: true });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId, token, userId } = req.body;
  try {
    const decoded = jwt.verify(token, publicKey);
    const user = await Users.findById(userId);
    if (decoded.email === user.userEmail) {
      const updatedCart = user.cart.filter(
        (item) => item.productId !== productId
      );
      const neew = await Users.findByIdAndUpdate(
        userId,
        { cart: updatedCart },
        { new: true }
      );
      // console.log(neew);
      res.json({
        removed: true,
        userName: neew.userName,
        userEmail: neew.userEmail,
        orders: neew.orders,
        cart: neew.cart,
        id: neew._id,
        authorise: true,
        address: neew.address,
        followingSellers: neew.followingSellers,
      });
    } else {
      res.json({
        removed: false,
      });
    }
  } catch (error) {
    res.json({
      removed: false,
      someOtherError: true,
    });
  }
};

exports.setQuantity = async (req, res) => {
  const { userId, token, productId, newQuantity } = req.body;
  try {
    const decoded = jwt.verify(token, publicKey);
    const user = await Users.findById(userId);
    if (decoded.email === user.userEmail) {
      const userCart = user.cart;
      const productThatShouldBeUpdate = userCart.filter(
        (item) => item.productId === productId
      )[0];
      const productsThatShouldNotBeUpdate = userCart.filter(
        (item) => item.productId !== productId
      );
      productThatShouldBeUpdate.quantity = newQuantity;
      productsThatShouldNotBeUpdate.push(productThatShouldBeUpdate);
      // user.cart = productsThatShouldNotBeUpdate;
      // await user.updateOne({_id:userId},{$set:{cart:productsThatShouldNotBeUpdate}});
      const neew = await Users.findByIdAndUpdate(
        userId,
        { cart: productsThatShouldNotBeUpdate },
        { new: true }
      );
      // await user.save();
      // console.log(neew);
      res.json({
        quantityUpdated: true,
        userName: neew.userName,
        userEmail: neew.userEmail,
        orders: neew.orders,
        cart: neew.cart,
        id: neew._id,
        authorise: true,
        address: neew.address,
        followingSellers: neew.followingSellers,
      });
    } else {
      res.json({
        quantityUpdated: false,
      });
    }
  } catch (error) {
    res.json({
      quantityUpdated: false,
      someOtherError: true,
    });
  }
};

exports.addAddress = async (req, res) => {
  const { token, userId } = req.body.userDetails;
  try {
    const decoded = jwt.verify(token, publicKey);
    const user = await Users.findById(userId);
    if (decoded.email === user.userEmail) {
      const nnn = await Users.findByIdAndUpdate(
        userId,
        { $set: { address: req.body.userAddress } },
        { new: true }
      );
      res.json({
        addressAdded: true,
      });
    } else {
      res.json({
        addressAdded: false,
      });
    }
  } catch (error) {
    res.json({
      addressAdded: false,
      someOtherError: true,
    });
  }
};

exports.placeOrder = async (req, res) => {
  const { userId, token } = req.body.userDetails;
  try {
    const decoded = jwt.verify(token, publicKey);
    const user = await Users.findById(userId);
    const sellers = await Sellers.find();
    if (decoded.email === user.userEmail) {
      const ResponseSeller = req.body.products.map((item) => {
        const seller = sellers.filter(
          (it) => it._id.toString() === item.sellerId
        )[0];

        //order unique id is compulsory becoz if any user order a same product with same quantity
        //then it's difficult to filter at time of updation when seller update the status of order
        const timestamp = Date.now().toString();
        const randomNum = Math.random().toString().slice(2, 8);

        seller.openOrders.push({
          orderedBy: {
            userName: user.userName,
            userEmail: user.userEmail,
            userId: userId,
          },
          userAddress: user.address,
          product: item,
          quantity: item.quantity,
          status: "Order Placed",
          orderUniqueId: `${timestamp}-${randomNum}`,
        });
        item.status = "Order Placed";
        item.orderUniqueId = `${timestamp}-${randomNum}`;
        delete item.productRating;
        delete item.productDescription;
        delete item.productStock;
        return seller;
      });
      for (let i = 0; i < ResponseSeller.length; i++) {
        const element = ResponseSeller[i];
        let updateddoc = await Sellers.findByIdAndUpdate(
          element._id.toString(),
          { $set: { openOrders: element.openOrders } },
          { new: true }
        );
      }
      user.orders.push(...req.body.products);
      user.cart = [];
      await user.save();
      res.json({
        orderPlaced: true,
      });
    } else {
      res.json({
        orderPlaced: false,
      });
    }
  } catch (error) {
    res.json({
      orderPlaced: false,
      someOtherError: true,
    });
  }
};

exports.getSellerShopData = async (req, res) => {
  const sellerId = req.body.sellerId;
  try {
    const seller = await Sellers.findById(sellerId);
    const sellerProducts = await Products.find({ sellerId: sellerId });

    if (seller && sellerProducts) {
      res.json({
        sellerFound: true,
        ShopName: seller.shopName,
        Owner: seller.ownerName,
        OwnerEmail: seller.sellerEmail,
        sellerId: sellerId,
        sellerProducts: sellerProducts,
        sellerFollowers: seller.followers,
      });
    } else {
      res.json({
        sellerFound: false,
      });
    }
  } catch (error) {
    res.json({
      sellerFound: false,
      someOtherError: true,
    });
  }
};

// const user = await Users.findOne({ userEmail: userEmail });
// if (user !== null) {
//   let token = jwt.sign({ email: userEmail }, privateKey, {
//     algorithm: "RS256",
//   });
//   if (bcrypt.compareSync(password, user.password)) {
//     res.json({
//       token: token,
//       authorise: true,
//     });
//     user.token = token;
//     await user.save();
//   }else{
//       res.json({ authorise: false });
//   }
// } else {
//   res.json({ authorise: false });
// }
// res.json({'success':'treu'});

// };
