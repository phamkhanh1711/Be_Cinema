const { CinemaHall } = require("../database/sequelize")

const getAllCinemaHall = async (req, res, next ) =>{
    try {
        const allCinemaHall = await CinemaHall.findAll()

        return res.status(200).json({
            allCinemaHall
        })
    } catch (error) {
        return next(error)
    }
}
module.exports= {
    getAllCinemaHall
}