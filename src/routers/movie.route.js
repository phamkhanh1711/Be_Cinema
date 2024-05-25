const express = require("express");
const {
    checkLoginAdmin
} = require("../middlewares/jwtMiddleware");

const {
   
    addMovie,
    printMovie,
    deleteMovie,
    printDetailMovie,
    updateMovie,
    searchMovies,
    currentMovie,
    upcomingMovie,
    getAllMovieType
} = require("../controller/movie.controller");
const movieRouter = express.Router();

movieRouter.route("/add-movie").post(addMovie);
movieRouter.route("/all-movie").get(checkLoginAdmin , printMovie);
movieRouter.route("/all-current-movie").get(currentMovie);
movieRouter.route("/all-upcoming-movie").get(upcomingMovie);
movieRouter.route("/detail-movie/:movieId").get(printDetailMovie);
movieRouter.route("/delete-movie/:movieId").delete( deleteMovie);
movieRouter.route("/update-movie/:movieId").put(updateMovie);
movieRouter.route("/search-movie").get(searchMovies);
movieRouter.route("/movieType").get(getAllMovieType)


module.exports = {
    movieRouter
};