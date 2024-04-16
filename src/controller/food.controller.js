const { User, Food } = require("../database/sequelize");

const addFood = async (req, res, next) => {
  try {
    const { foodName, foodPrice, foodImage } = req.body;
    const ListFood = await Food.create({
      foodName,
      foodPrice,
      foodImage,
    });

    return res
      .status(200)
      .json({ data: ListFood, message: "Food added successfully" });
  } catch (error) {
    return next(error);
  }
};

const printFood = async (req, res, next) => {
  try {
    const allFoods = await Food.findAll();
    res.status(200).json(allFoods);
  } catch (error) {
    return next(error);
  }
};
const deleteFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    await Food.destroy({ where: { foodId } });
    return res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { foodName, foodPrice, foodImage } = req.body;
    await Food.update(
      { foodName, foodPrice, foodImage },
      { where: { foodId } }
    );

    return res.status(200).json({ message: "Food updated successfully" });
  } catch (error) {
    return next(error);
  }
};



const printDetailFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const detailFood = await Food.findOne({
      where: {
        foodId,
      },
    });
    return res.status(200).json(detailFood);
  } catch (error) {
    return res.status(500).json({ error: "Food not found" });
  }
};


module.exports = {
  addFood,
  deleteFood,
  updateFood,
  printFood,
  printDetailFood,
};