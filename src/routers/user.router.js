const express = require("express");
const { auth, checkLoginAdmin } = require("../middlewares/jwtMiddleware");
const {
  getUser,
  getUsers,
  getSearchUsers,
  updateUser,
} = require("../controller/user.controller");

const userRouter = express.Router();

userRouter.route("/allUser").get(checkLoginAdmin, getUsers);
userRouter.route("/search").get(getSearchUsers);
  userRouter.route("/update/:id").put(updateUser);
userRouter.route("/:id").get(getUser);

module.exports = {
  userRouter,
};