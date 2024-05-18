const { Op } = require("sequelize");
const {
  Movie,
  MovieType,
  Show,
  CinemaHall,
  Seat,
  CinemaHallSeat,
  sequelize,
} = require("../database/sequelize");
const moment = require("moment");

// Tạo lịch chiếu của admin
const createShow = async (req, res, next) => {
  try {
    const {
      CreateOn, // ngày tạo lịch chiếu (yyyy-MM-dd)
      startTime,  // giờ bắt đầu chiếu (HH:mm)
      endTime, // giờ kết thúc chiếu (HH:mm)
      cinemaHallName, // tên rạp chiếu
      typeName, // loại phim 2D, 3D, 4D
      movieName, // tên phim
      priceSeat, // giá vé
    } = req.body;
    if (startTime >= endTime) {
      return res.status(400).json({
        message: "Giờ bắt đầu phải nhỏ hơn giờ kết thúc",
      });
    } else {
      const currMovie = await Movie.findOne({
        where: {
          movieName: movieName,
        },
      });
      const currMovieType = await MovieType.findOne({
        where: {
          typeName: typeName,
        },
      });

      const currCinemaHall = await CinemaHall.findOne({
        where: {
          cinemaHallName: cinemaHallName,
        },
        include: {
          model: Seat,
        },
      });

      const verifyShow = await Show.findAll({
        where: {
          cinemaHallId: currCinemaHall.cinemaHallId,
          CreateOn: CreateOn,
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: startTime } },
              ],
            },
            {
              startTime: { [Op.gt]: startTime },
              endTime: { [Op.lt]: endTime },
            },
          ],
        },
      });

      if (verifyShow.length > 0) {
        return res.status(409).json({ message: "Lịch chiếu đã bị trùng" });
      } else {
        const newShow = await Show.create({
          CreateOn: CreateOn,
          startTime: startTime,
          endTime: endTime,
          cinemaHallId: currCinemaHall.cinemaHallId,
          movieId: currMovie.movieId,
          movieTypeId: currMovieType.movieTypeId,
        });
        
        for (let index = 0; index < currCinemaHall.Seats.length; index++) {
          let price;
          if (currCinemaHall.Seats[index].type === "doi") {
            console.log(1);
            price = priceSeat * 2;
          } else {
            price = priceSeat;
          }
          const newCinemaHallSeat = await CinemaHallSeat.create({
            priceSeat: price,
            showId: newShow.showId,
            seatId: currCinemaHall.Seats[index].seatId,
          });
        }
        return res.status(200).json({
          message: "Tạo lịch chiếu thành công",
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

// Cập nhật lịch chiếu
const updateShow = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const {
      CreateOn,
      startTime,
      endTime,
      cinemaHallName,
      typeName,
      movieName,
      priceSeat,
    } = req.body;
    if (startTime >= endTime) {
      return res.status(400).json({
        message: "Giờ bắt đầu phải nhỏ hơn giờ kết thúc",
      });
    } else {
      const currMovie = await Movie.findOne({
        where: {
          movieName: movieName,
        },
      });
      const currMovieType = await MovieType.findOne({
        where: {
          typeName: typeName,
        },
      });

      const currCinemaHall = await CinemaHall.findOne({
        where: {
          cinemaHallName: cinemaHallName,
        },
        include: {
          model: Seat,
        },
      });

      const verifyShow = await Show.findAll({
        where: {
          cinemaHallId: currCinemaHall.cinemaHallId,
          CreateOn: CreateOn,
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: startTime } },
              ],
            },
            {
              startTime: { [Op.gt]: startTime },
              endTime: { [Op.lt]: endTime },
            },
          ],
        },
      });

      if (verifyShow.length > 0) {
        return res.status(409).json({ message: "Lịch chiếu đã bị trùng" });
      } else {
        const updateShow = await Show.update(
          {
            CreateOn: CreateOn,
            startTime: startTime,
            endTime: endTime,
            cinemaHallId: currCinemaHall.cinemaHallId,
            movieId: currMovie.movieId,
            movieTypeId: currMovieType.movieTypeId,
          },
          {
            where: {
              showId: showId,
            },
          }
        );
        for (let index = 0; index < currCinemaHall.Seats.length; index++) {
          let price;
          if (currCinemaHall.Seats.type === "doi") {
            price = priceSeat * 2;
          } else {
            price = priceSeat;
          }
          const updateCinemaHallSeat = await CinemaHallSeat.update(
            {
              priceSeat: price,
            },
            {
              where: {
                showId: showId,
                seatId: currCinemaHall.Seats[index].seatId,
              },
            }
          );
        }
      }
    }
    return res.status(200).json({
      message: "Cập nhật lịch chiếu thành công",
    });
  } catch (error) {
    return next(error);
  }
};

//Xóa lịch chiếu
const deleteShow = async (req, res, next) => {
  try {
    const { showId } = req.params;

    await Show.destroy({
      where: {
        showId: showId,
      },
    });

    await CinemaHallSeat.destroy({
      where: {
        showId: showId,
      },
    });

    return res.status(200).json({
      message: "Xóa lịch chiếu thành công",
    });
  } catch (error) {
    return next(error);
  }
};

// Lây tất cả lịch chiếu cho admin
const getAllShow = async (req, res, next) => {
  try {
    const { CreateOn } = req.query;
    console.log(CreateOn);
    let startDate, endDate;
    if (CreateOn === "") {
      const today = new Date();
      startDate = moment(today).format("yyyy-MM-DD");
      console.log(startDate);
      const future = new Date(today.setDate(today.getDate() + 15));
      endDate = moment(future).format("yyyy-MM-DD");
    }
    const allShow = await Show.findAll({
      where: {
        [Op.or]: [
          {
            CreateOn: CreateOn,
          },
          {
            CreateOn: { [Op.between]: [startDate, endDate] },
          },
        ],
      },
      include: [
        {
          model: Movie,
        },
        {
          model: CinemaHall,
          attributes: ["cinemaHallName"],
        },
      ],
    });

    return res.status(200).json({
      data: {
        allShow,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// chi tiết lịch chiếu
const getDetailShow = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const detailShow = await Show.findOne({
      where: {
        showId: showId,
      },
      include: [
        {
          model: Movie,
        },
        {
          model: CinemaHall,
          attributes: ["cinemaHallName"],
        },
        {
          model: MovieType,
        },
        {
          model: CinemaHallSeat,
          attributes: ["priceSeat"],
        },
      ],
    });

    return res.status(200).json({
      data: {
        detailShow,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// lấy tất cả lịch chiếu của phim cho người dùng đặt
const getShowTicket = async (req, res, next) => {
  try {
    const { CreateOn } = req.query;
    console.log(CreateOn);
    const { movieId } = req.params;
    const today=  moment(new Date()).format("yyyy-MM-DD")
    let hours , minute
    if(CreateOn === today){
      hours = new Date().getHours();
      minute = new Date().getMinutes();
    }else{
       hours = "00"
       minute= "00"
    }
    const getShow = await Movie.findOne({
      where: {
        movieId: movieId,
      },
      attributes: ["movieName"],
      include: [
        {
          model: MovieType,
          include: [
            {
              model: Show,
              where: {
                [Op.and]: [
                  {
                    movieId: movieId,
                    CreateOn: CreateOn,
                    startTime: { [Op.gte]: `${hours}:${minute}` },
                  },
                ],
              },
            },
          ],
        },
      ],
      order: [
        [MovieType, Show, "startTime", "ASC"], // Sắp xếp theo startTime
      ],
    });
    return res.status(200).json({
      getShow,
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  createShow,
  getAllShow,
  getShowTicket,
  getDetailShow,
  updateShow,
  deleteShow,
};