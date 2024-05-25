const { Promotion, User } = require("../database/sequelize");
const moment = require("moment");
const { auth } = require("../middlewares/jwtMiddleware");
const { Op } = require("sequelize");

//Tạo vé khuyến mãi
const createPromotion = async (req, res, next) => {
  try {
    const {
      code,
      promotionName,
      description,
      discount,
      startDate,
      endDate,
      imagePromo,
    } = req.body;

    if (startDate < endDate) {
      const newPromotion = await Promotion.create({
        code,
        promotionName,
        description,
        discount,
        startDate,
        endDate,
        imagePromo,
      });

      return res.status(200).json({
        data: {
          newPromotion,
        },
        message: "Tạo vé khuyến mãi thành công",
      });
    } else {
      return res.status(400).json({
        message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
      });
    }
  } catch (error) {
    return next(error);
  }
};

// Cập nhật vé khuyến mãi
const updatePromotion = async (req, res, next) => {
  try {
    const { promotionId } = req.params;
    const {
      code,
      promotionName,
      description,
      discount,
      startDate,
      endDate,
      imagePromo,
    } = req.body;
    const currPromo = await Promotion.findOne({
      where: {
        promotionId: promotionId,
      },
    });
    if (startDate < endDate) {
      const updaPromotion = await Promotion.update(
        {
          code: code || currPromo.code,
          promotionName: promotionName || currPromo.promotionName,
          description: description || currPromo.description,
          discount,
          startDate,
          endDate,
          imagePromo,
        },
        {
          where: {
            promotionId: promotionId,
          },
        }
      );

      return res.status(200).json({
        message: "Cập nhật mã khuyến mãi thành công",
      });
    } else {
      return res.status(400).json({
        message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
      });
    }
  } catch (error) {
    return next(error);
  }
};

// Hiển thị tất cả vé khuyến mãi cho admin
const getAllPromotion = async (req, res, next) => {
  try {
    const allPromo = await Promotion.findAll();

    return res.status(200).json({
      data: {
        allPromo,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// hiển thị chi tiết vé km
const getDetailPromo = async (req, res, next) => {
  try {
    const { promotionId } = req.params;

    const detailPromo = await Promotion.findOne({
      where: {
        promotionId,
      },
    });

    return res.status(200).json({
      data: {
        detailPromo,
      },
    });
  } catch (error) {
    return next(error);
  }
};

//hiển thị vé khuyến mãi cho người dùng
const getAllPromoUser = async (req, res, next) => {
  try {
    const today = new Date();
    const endDate = moment(today).format("yyyy-MM-DD");
    const allPromoUser = await Promotion.findAll({
      where: {
        endDate: {[Op.gte]: endDate },
      },
    });

    return res.status(200).json({
      data: {
        allPromoUser,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// kiểm tra vé khuyến mãi đã được dùng chưa
const checkPromotion = async (req, res, next) => {
  try {
    const { code } = req.query;
    const currUser = await auth(req, res, next);
    const check = await Promotion.findOne({
      where: {
        code: code,
      },
    });
    if(check === null){
      return res.status(400).json({
        message: "Mã khuyến mãi không tồn tại",
      });
    }

    if (code !== "") {
      
      const checkPromo = await Promotion.findOne({
        where: {
          code: code,
        },
        include: [
          {
            model: User,
            where: {
              userId: currUser.userId,
            },
          },
        ],
      });
      console.log(checkPromo);
      if (checkPromo !== null) {
        console.log(1);
        return res.status(400).json({
          message: "Mã khuyến mãi đã được dùng",
        });
      } else {
        const currPromo = await Promotion.findOne({
          where: {
            code: code,
          },
          attributes: ["discount","code"],
        });
        return res.status(200).json({
          currPromo, 
        });
      }
    } else {
      return res.status(400).json();
    }
  } catch (error) {
    return next(error);
  }
};

//Lưu vé đã được sử dụng của người dùng
const savePromo = async (req, res, next) => {
  try {
    const { code } = req.body;
    const currUser = await auth(req, res, next);
    const currPromo = await Promotion.findOne({
      where: {
        code: code,
      },
    });
    await currPromo.addUser(currUser.userId);
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

module.exports = {
  checkPromotion,
  createPromotion,
  updatePromotion,
  getAllPromoUser,
  getDetailPromo,
  getAllPromotion,
  savePromo
};