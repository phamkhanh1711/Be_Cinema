const jwt = require("jsonwebtoken");
require("dotenv").config();
const { compare } = require("bcrypt");
const { User } = require("../database/sequelize");

const auth = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;  
    if (!bearerToken) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized - Người Dùng Chưa Đăng Nhập !",
      });
    }
    const accessToken = bearerToken.split(" ")[1];
    let data;
    try {
      data = jwt.verify(accessToken, "CAPSTONE2");
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized - Token Không Hợp Lệ !",
      });
    }

    let user = await User.findOne({
      where: {
        userId: data.userId,
        role: data.role,
      },
      raw: true,
    });

    return user;
  } catch (error) {
    return next(error);
  }
};
const checkLoginAdmin = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized - Người Dùng Chưa Đăng Nhập !",
      });
    }

    const accessToken = bearerToken.split(" ")[1];
    const data = jwt.verify(accessToken, "CAPSTONE2");

    const user = await User.findOne({
      where: {
        userId: data.userId,
        role: data.role,
      },
      raw: true,
    });
    
    // Check if user's role is equal to 1 (admin role)
    if (user.role !== 1) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden - Người Dùng Không Đủ Quyền Truy Cập !",
      });
    }

    
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  auth,
  checkLoginAdmin,
};
