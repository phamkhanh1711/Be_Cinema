const cinemaHallSeatModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "CinemaHallSeat",
    {
      cinemaHallSeatId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      priceSeat: {
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
    cinemaHallSeatModel
}