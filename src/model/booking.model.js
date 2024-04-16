const bookingModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Booking",
    {
      bookingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
module.exports = {
    bookingModel
}