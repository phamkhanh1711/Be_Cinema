const { Op } = require("sequelize")
const { CinemaHallSeat, Seat } = require("../database/sequelize")

const getSeat = async (req, res, next) => {
    try {
        const {showId} = req.params
        const A = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'A'
                        }
                    }
                }
            ]
        })
        const B = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'B'
                        }
                    }
                }
            ]
        })
        const C = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'C'
                        }
                    }
                }
            ]
        })
        const D = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'D'
                        }
                    }
                }
            ]
        })
        const E = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'E'
                        }
                    }
                }
            ]
        })
       
        const G = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'G'
                        }
                    }
                }
            ]
        })
        const H = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'H'
                        }
                    }
                }
            ]
        })
        const I = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]: 'I'
                        }
                    }
                }
            ]
        })
        const seatJ = await CinemaHallSeat.findAll({
            where: {
                showId: showId
            },
            include: [
                {
                    model: Seat,
                    where: {
                        numberSeat: {
                            [Op.startsWith]:'J'
                        }
                    }
                }
            ]
        })
        return res.status(200).json({
            A,
            B,
           C,
            D,
            E,
           
            G,
            H,
            I,
            seatJ
        })
    } catch (error) {
        return next(error)
    }
}
module.exports = {
    getSeat
}