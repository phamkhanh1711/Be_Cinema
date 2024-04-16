const express = require("express");
const {
    checkValidate,
    checkSignUp,
    checkLogin,
} = require("../middlewares/authMiddleware");

const {
    addMovie,
    printMovie,
    deleteMovie,
    printDetailMovie,
    editMovie
} = require("../controller/movie.controller");
const movieRouter = express.Router();

movieRouter.route("/add-movie").post(addMovie);
movieRouter.route("/all-movie").get(printMovie);
movieRouter.route("/delete-movie/:movieId").delete(deleteMovie);
movieRouter.route("/detail-movie/:movieId").get(printDetailMovie);
movieRouter.route("/update-movie/:movieId").put(editMovie);
module.exports = {
    movieRouter
};
