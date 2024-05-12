const express = require("express");
const { getAllCinemaHall } = require("../controller/cinemaHall.controler");
const cinemaHallRouter = express.Router();

cinemaHallRouter.route("/allCinemaHall").get(getAllCinemaHall)

module.exports={
    cinemaHallRouter
}