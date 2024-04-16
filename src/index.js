const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./database/sequelize");
const { userRouter } = require("./routers/user.router");
const { authRouter } = require("./routers/auth.route");
const { movieRouter } = require("./routers/movie.route");
const { foodRouter } = require("./routers/food.route");
const path = require("path");

const app = express();
const port = 4000;

const corOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corOptions));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/movie", movieRouter);
app.use("/food", foodRouter);

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
