const express = require("express");
const { createPaymentUrlService, getPaymentDetail } = require("../controller/payment.controller");

const paymentRouter = express.Router();

paymentRouter.route("/create-payment-url").post(createPaymentUrlService);
paymentRouter.route("/payment-detail").get(getPaymentDetail);

module.exports = {
  paymentRouter,
};