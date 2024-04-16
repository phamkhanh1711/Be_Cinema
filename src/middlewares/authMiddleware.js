const { User } = require("../database/sequelize");



const checkSignUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: "Email đã tồn tại!",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const checkLogin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Email không tồn tại!",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  checkLogin,
  checkSignUp,
 
};
