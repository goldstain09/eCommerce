const model = require("../Model/User");
const fs = require("fs");
const path = require("path");
const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../private.key"),
  "utf-8"
);
const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../public.key"),
  "utf-8"
);
const Users = model.Users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const user = new Users(req.body);
  let token = jwt.sign({ email: req.body.userEmail }, privateKey, {
    algorithm: "RS256",
  });
  user.token = token;
  const hash = bcrypt.hashSync(req.body.password, 10);
  user.password = hash;
  try {
    const createdUser = await user.save();
    res.json({ token: createdUser.token });
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
        res.json({
          token: newEmailtoken,
          authorise: true,
        });
        console.log("asd");
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
          authorise: true,
          added: true,
         });
      }
    }
  } catch (error) {
    res.json({ added: false, someOtherError: true });
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
