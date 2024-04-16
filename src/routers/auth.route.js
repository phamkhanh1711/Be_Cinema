const express = require("express");
const {
  
  checkSignUp,
  checkLogin,
} = require("../middlewares/authMiddleware");
const { signUp, login } = require("../controller/auth.controller");
const authRouter = express.Router();

authRouter.route("/signup").post( checkSignUp, signUp);

authRouter.route("/login").post( checkLogin, login);

module.exports = {
  authRouter,
};
