const express = require("express");
const { checkLoginAdmin } = require("../middlewares/jwtMiddleware");
const {
  addFood,
  deleteFood,
  updateFood,
 
  printFood,
  printDetailFood,
} = require("../controller/food.controller");
const foodRouter = express.Router();

foodRouter.route("/add-food").post(checkLoginAdmin, addFood);
foodRouter.route("/delete/:foodId").delete(checkLoginAdmin, deleteFood);
foodRouter.route("/update/:foodId").put(checkLoginAdmin, updateFood);
foodRouter.route("/print-detailFood/:foodId").get(checkLoginAdmin, printDetailFood);
foodRouter.route("/all-Food").get( printFood);

module.exports = {
  foodRouter,
};