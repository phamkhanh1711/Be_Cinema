const {
  Booking,
  BookingTicket,
  BookingFood,
  User,
  CinemaHallSeat,
  Show,
  Food,
  Movie,
  Seat,
  CinemaHall,
  sequelize,
  Payment,
} = require("../database/sequelize");
const { auth } = require("../middlewares/jwtMiddleware");
const { Op } = require("sequelize");
//đặt vé

const createBooking = async (req, res, next) => {
  try {
    const { totalPrice, showId, seat, food } = req.body;
    console.log(totalPrice, showId, seat, food);
    if (seat.length === 0) {
      return res.status(400).json({
        message: "Ghế chưa được chọn",
      });
    } else {
      const currUser = await auth(req, res, next);

      const createBook = await Booking.create({
        totalPrice,
        createOn: new Date(),
        userId: currUser.userId,
      });
      let changeSeat;
      let createBookTicket;
      for (const seatId of seat) {
        await CinemaHallSeat.update(
          {
            isBooked: true,
          },
          {
            where: {
              seatId: seatId,
              showId,
            },
          }
        );
        changeSeat = await CinemaHallSeat.findOne({
          where: {
            seatId: seatId,
            showId,
          },
        });
        createBookTicket = await BookingTicket.create({
          ticketPrice: changeSeat.priceSeat,
          bookingId: createBook.bookingId,
          showId,
          cinemaHallSeatId: changeSeat.cinemaHallSeatId,
        });
      }
      let searchFood;
      let createBookFood;
      for (const foodId in food) {
        if (Number(food[foodId]) !== 0) {
          searchFood = await Food.findOne({
            where: {
              foodId: Number(foodId),
            },
          });
          const price = searchFood.foodPrice * Number(food[foodId]);

          createBookFood = await BookingFood.create({
            priceFood: price,
            quantity: Number(food[foodId]),
            foodId: searchFood.foodId,
            bookingId: createBook.bookingId,
          });
        }
      }
      await Payment.create({
        amount: totalPrice,
        paymentDate: new Date(),
        bookingId: createBook.bookingId,

      })
      return res.status(200).json({
        data: {
          createBook,
          // createBookTicket,
          // createBookFood,
        },
        message: "Bạn đã đặt vé thành công",
      });
    }
  } catch (error) {}
};

// xem lịch sử đặt vé tổng quát của người dùng
const getAllBookingforUser = async (req, res, next) => {
  try {
    const currUser = await auth(req, res, next);
    console.log(currUser.userId);
    const getAllBooking = await Booking.findAll({
      where: {
        userId: currUser.userId,
      },

     
      include: [
        {
          model: BookingTicket,
          attributes: ["bookingTicketId"],
          include: {
            model: Show,
            include: [
              {
                model: Movie,
                attributes: ["movieName", "movieImage"],
              },
              {
                model: CinemaHall,
                attributes: ["cinemaHallName"],
              },
            ],
          },
        },
      ],
      order: [["createOn", "DESC"]],
    });

    return res.status(200).json({
      data: {
        getAllBooking,
      },
    });
  } catch (error) {
    return next(error);
  }
};

//xem lịch sử đặt vé chi tiết
const getDetailBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const detailBooking = await Booking.findOne({
      where: {
        bookingId: bookingId,
      },
      include: [
        {
          model: User,
        },
      ],
    });

    const detailBookingTicket = await BookingTicket.findAll({
      where: {
        bookingId: bookingId,
      },
      include: [
        {
          model: Show,
          include: [
            {
              model: Movie,
              attributes: ["movieName", "movieImage"],
            },
            {
              model: CinemaHall,
              attributes: ["cinemaHallName"],
            },]
        },
        {
          model: CinemaHallSeat,
          include: {
            model: Seat,
          },
        },
      ],
    });

    const detailBookingFood = await BookingFood.findAll({
      where: {
        bookingId: bookingId,
      },
      include: {
        model: Food,
      },
    });
    let ticketPrice = 0
    for (const tickets of detailBookingTicket) {
      ticketPrice = ticketPrice + tickets.ticketPrice
    }
    console.log(ticketPrice);
    let foodPrice = 0
    for (const foods of detailBookingFood) {
      foodPrice = foodPrice + foods.priceFood
    }
    console.log(foodPrice);
    let prommoPrice = (ticketPrice + foodPrice) -  detailBooking.totalPrice 
    console.log(prommoPrice);
    return res.status(200).json({
      data: {
        detailBooking,
        detailBookingTicket,
        detailBookingFood,
        prommoPrice
      },
    });
  } catch (error) {
    return next(error);
  }
};
const searchBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.query;

    const bookingResult = await Booking.findAll({
      where: {
        bookingId: {
          [Op.like]: `%${bookingId}%`,
        },
      },
      include: [
        {
          model: User,
          attributes: ["fullName", "email", "avatar"],
          // where: searchName
        },
        {
          model: BookingTicket,
          attributes: ["bookingTicketId"],
          include: {
            model: Show,
            include: {
              model: Movie,
              attributes: ["movieName", "movieImage"],
            },
          },
        },
      ],
      order: [["createOn", "DESC"]],
    });

    return res.status(200).json({
      data: {
        bookingResult,
      },
    });
  } catch (error) {
    return next(error);
  }
};
/*
 Lịch sử đặt vé cho admin
 */

 const getAllBookingforAdmin = async (req, res, next) => {
  try {
    const getAllBooking = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ["fullName", "email", "avatar"],
          // where: searchName
        },
        {
          model: BookingTicket,
          attributes: ["bookingTicketId"],
          include: {
            model: Show,
            include: {
              model: Movie,
              attributes: ["movieName", "movieImage"],
            },
          },
        },
      ],
      order: [["createOn", "DESC"]]
    });
    // const sumPrice = await Booking.sum("totalPrice",{where: {
    //   [Op.or]: [
    //   sequelize.where(
    //     sequelize.fn("Year", sequelize.col("createOn")),
    //     createOn
    //   ),
    //   sequelize.where(
    //     sequelize.fn("Month", sequelize.col("createOn")),
    //     createOn
    //   ),
    //   {createOn: createOn}
    // ]
    // },});
    return res.status(200).json({
      data: {
        getAllBooking,
        // sumPrice,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// hiện thị lịch sử đặt vé ở admin theo id người dùng
const allBookingofUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { movieName } = req.query;
    const name =
      movieName === ""
        ? {}
        : {
            movieName: {
              [Op.like]: `%${movieName}%`,
            },
          };
    const getAllBooking = await Booking.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: BookingTicket,
          attributes: ["bookingTicketId"],
          include: {
            model: Show,
            attributes: ["showId"],
            include: {
              model: Movie,
              where: name,
              attributes: ["movieName", "movieImage"],
            },
          },
        },
      ],
      order: [["createOn", "DESC"]],
    });

    return res.status(200).json({
      data: {
        getAllBooking,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  searchBooking,
  getAllBookingforUser,
  getDetailBooking,
  createBooking,
  getAllBookingforAdmin,
  allBookingofUser,
};