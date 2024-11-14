const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const { verify } = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {

  registerUser: async (req, res) => {
    const { password, email } = req.body;

    try {
      const user = await userModel.createUser(password, email);
      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  },

  putLike: async (req, res) => {
    const { user_id, item_id, value, likes_list} = req.body;
    try {
      const like = await userModel.useLike(user_id, item_id, value, likes_list);
      res.status(200).json({
        message: "[Un]like successfully",
        like,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },

  loginUser: async (req, res) => {
    const { password, email } = req.body;
    // console.log(req.body);
    try {
      const user = await userModel.getUserByEmail(email);
      console.log("Login:",user);
      if (!user) {
        return res.status(404).json({ message: "User not found..." });
      }

      const passwordMatch = await bcrypt.compare(password + "", user.password);

      if (!passwordMatch) {
        return res.status(404).json({ message: "Wrong password" });
      }

      /** generate token */
      const accessToken = jwt.sign(
        { userid: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );

      /** set token in httpOnly cookie */
      res.cookie("token", accessToken, {
        maxAge: 60 * 1000,
        httpOnly: true,
      });

      res.status(200).json({
        message: "Login successfully",
        user: { userid: user.id, email: user.email },
        token: accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },

  logoutUser: (req, res) => {
    console.log("Logout:", req.cookies);
    res.clearCookie("token");
    req.cookies.token = null;
    delete req.cookies.token;
    delete req.headers["x-access-token"];
    res.sendStatus(200);
  },
  
  verifyAuth: (req, res) => {
    /** generate token */

    const { userid, email } = req.userinfo;
    const accessToken = jwt.sign(
      { userid, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    /** set token in httpOnly cookie */
    res.cookie("token", accessToken, {
      maxAge: 60 * 1000 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.json({
      message: "Verify Auth",
      user: { userid, email },
      token: accessToken,
    });
  },
};
