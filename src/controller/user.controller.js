const { User } = require("../database/sequelize");
const { auth } = require("../middlewares/jwtMiddleware");
const { Booking } = require("../database/sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../database/sequelize");
const getUsers = async (req, res, next) => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const users = await User.findAll({
      where: {
        role: 3,
      },
      order: [["createdAt", "ASC"]],
    });

    const usersWithTotalPrice = await Promise.all(
      users.map(async (user) => {
        const bookings = await Booking.findAll({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("Year", sequelize.col("createOn")),
                year
              ),
              sequelize.where(
                sequelize.fn("Month", sequelize.col("createOn")),
                month
              ),
              { userId: user.userId },
            ],
          },
        });

        let Price = 0;
        for (const booking of bookings) {
          // Sum the price of all tickets for the booking
          Price = Price + booking.totalPrice;
        }

        // Add totalPrice to user data
        return {
          ...user.toJSON(),
          Price,
        };
      })
    );
    let totalPrice = 0;
    const totalPriceBooking = await Booking.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("totalPrice")), "totalRevenue"],
      ],
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("Year", sequelize.col("createOn")),
            year
          ),
          sequelize.where(sequelize.fn("Month", sequelize.col("createOn")), month),
        ],
      },
      raw: true
    });
    if (totalPriceBooking[0].totalRevenue !== null) {
      totalPrice = totalPriceBooking;
    }
    return res.status(200).json({
      data: { users:usersWithTotalPrice, totalPrice:totalPrice },
    });
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findUser = await User.findOne({
      where: {
        userId: id,
      },
    });
    if (!findUser) {
      return res.status(404).json({
        status: 404,
        message: "Người Dùng Không Tồn Tại !",
      });
    }
    return res.status(200).json({
      status: 200,
      data: findUser,
    });
  } catch (error) {
    return next(error);
  }
};

const getSearchUsers = async (req, res, next) => {
  try {
    const { fullName } = req.query; // Lấy giá trị fullName từ tham số trên URL
    console.log(fullName);
    if (!fullName) {
      throw new Error("Name is required.");
    }

    const listUser = await User.findAll({
      raw: true,
      where: {
        role: 3,
      },
    });

    const list = listUser.filter((item) => {
      if (item.fullName && typeof item.fullName === "string") {
        return item.fullName.toLowerCase().includes(fullName.toLowerCase());
      }
      return false;
    });

    return res.status(200).json({
      data: list,
      message: "Get Search User Successfully",
    });
  } catch (error) {
    return next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const crrUser = await auth(req, res, next);
    const { fullName, avatar, phoneNumber } = req.body;

    let modifiedFullName = fullName || crrUser.fullName;
    let modifiedAvatar = avatar || crrUser.avatar;
    let modifiedPhoneNumber = phoneNumber || crrUser.phoneNumber;
    await User.update(
      {
        fullName: modifiedFullName,
        avatar: modifiedAvatar,
        phoneNumber: modifiedPhoneNumber,
      },
      {
        where: {
          userId: crrUser.userId,
        },
      }
    );
    return res.status(200).json({
      status: 200,
      message: "Cập Nhật Thành Công !",
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getUser,
  getUsers,
  getSearchUsers,
  updateUser,
};