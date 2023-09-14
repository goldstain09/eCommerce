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
        authorise: true,
      });
    }
  } catch (error) {
    res.json({ authorise: false });
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
    }else{
        res.json({ authorise: false });
    }
  } else {
    res.json({ authorise: false });
  }

  // const token = req.get("Authorization").split("Bearer ")[1];
  // bcrypt.compareSync(myPlaintextPassword, hash);
};
