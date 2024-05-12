const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize, User } = require("./database/sequelize");
const { bookingRouter } = require("./routers/booking.router");
const { authRouter } = require("./routers/auth.route");
const { commentRouter } = require("./routers/comment.router");
const { showRouter } = require("./routers/show.router");
const { promoRouter } = require("./routers/promotion.route");
const { seatRouter } = require("./routers/seat.router");
const { movieRouter } = require("./routers/movie.route");
const { userRouter } = require("./routers/user.router");
const { foodRouter } = require("./routers/food.route");
const { cinemaHallRouter } = require("./routers/cinemaHall.router");
const path = require("path");
const { paymentRouter } = require("./routers/payment.router");

const app = express();
const port = 4000;

const corOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors(corOptions));
app.use("/auth", authRouter);
app.use("/booking", bookingRouter);
app.use("/comment", commentRouter)
app.use("/show", showRouter)
app.use("/promotion", promoRouter)
app.use("/seat",seatRouter)
app.use("/movie", movieRouter)
app.use("/user", userRouter);
app.use("/food", foodRouter);
app.use("/cinemaHall",cinemaHallRouter)
app.use("/payment", paymentRouter)
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })

  .catch((err) => {
    console.error("Unable to connect to the database");
  });
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
