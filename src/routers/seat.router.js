const express = require("express");
const { getSeat } = require("../controller/seat.controller");
const seatRouter = express.Router();

seatRouter.route("/allSeat/:showId").get(getSeat);

module.exports = {
  seatRouter,
};