const express = require("express");
const {
  searchBooking,
  getDetailBooking,
  createBooking,
  getAllBookingforUser,
  getAllBookingforAdmin,
  allBookingofUser,
} = require("../controller/booking.controller");
const { checkLoginAdmin } = require("../middlewares/jwtMiddleware");
const bookingRouter = express.Router();

//đặt vé
bookingRouter.route("/createbooking").post(createBooking);

bookingRouter.route("/user/allBooking").get(getAllBookingforUser);

bookingRouter.route("/detailBooking/:bookingId").get(getDetailBooking);

bookingRouter.route("/admin/allBooking").get(getAllBookingforAdmin);

bookingRouter.route("/admin/allBookingofUser/:userId").get(allBookingofUser)

bookingRouter.route("/searchBooking").get(searchBooking)
module.exports = {
  bookingRouter,
};