const express = require("express");
const { checkLoginAdmin } = require("../middlewares/jwtMiddleware");
const { checkPromotion, createPromotion, getDetailPromo, updatePromotion, getAllPromotion, getAllPromoUser, savePromo } = require("../controller/promotion.controller");
const promoRouter = express.Router();

//tạo vé khuyến mãi
promoRouter.route("/ticketfree").post(createPromotion)

// cập nhật vé
promoRouter.route("/updatePromo/:promotionId").put(updatePromotion)

//hiển thị toàn bộ vé cho admin
promoRouter.route("/allPromo").get(checkLoginAdmin,getAllPromotion)

//hiển thị toàn bộ vé bên người dùng
promoRouter.route("/allPromoUser").get(getAllPromoUser)

// chi tiết vé
promoRouter.route("/detailPromo/:promotionId").get(getDetailPromo)

// kiểm tra vé khuyến mãi đã được sử dùng chưa
promoRouter.route("/checkPromo").get(checkPromotion)

// lưu thông tin vé khuyến mãi người dùng đã sử dụng
promoRouter.route("/savePromo").post(savePromo)

module.exports = {
    promoRouter
}