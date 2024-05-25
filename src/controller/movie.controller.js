const { Op } = require('sequelize');
const { Movie, Show, MovieType } = require('../database/sequelize')
const moment = require("moment");


/*
Thang
Print all movies in database
*/

const printMovie = async (req, res) => {
    try {
        const allMovies = await Movie.findAll({include:{model: MovieType}})
        res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({ error: 'Movie not found' });
    }
}
/*
Thang
prints the currently playing movie
*/

const currentMovie = async (req, res) => {
    try {
        let startDate;

        const today = new Date();
        startDate = moment(today).format("yyyy-MM-DD")
        const allCurrentMovie = await Movie.findAll({
            include: {
                model: Show,
                where: {
                    CreateOn: startDate
                }
            }
        });

        return res.status(200).json({

            allCurrentMovie

        });
    } catch (error) {
        console.error(error); // Log lỗi
        return res.status(500).json({ error: "Internal Server Error" }); // Phản hồi lỗi
    }
}
/*
Thang
prints the currently playing movie
print the expected film
*/
const upcomingMovie = async (req, res) => {
    try {
        let startDate, endDate;
        const today = new Date();
        const next_day = new Date(today.setDate(today.getDate() + 1));

        startDate = moment(next_day).format("yyyy-MM-DD")
        const future = new Date(next_day.setDate(next_day.getDate() + 15));
        endDate = moment(future).format('yyyy-MM-DD')

        const allUpcomingMovie = await Movie.findAll({
            include: [
                {
                    model: Show,
                    where: {
                        CreateOn: { [Op.between]: [startDate, endDate] }
                    },
                },
            ],
        });

        return res.status(200).json({
            allUpcomingMovie
        });
    } catch (error) {
        return next(error);
    }
};
/*
Thang
Print detail movies from database
*/

const printDetailMovie = async (req, res) => {
    const { movieId } = req.params
    try {
        const detaiMovie = await Movie.findOne({
            where: {
                movieId
            }
        })
        return res.status(200).json(detaiMovie);
    } catch (error) {
        return res.status(500).json({ error: 'Movie not found' });
    }
}

/*
Thang
Function add a new movie
*/
const addMovie = async (req, res) => {
    const {
      movieName,
      movieCategory,
      movieDescription,
      movieDirector,
      movieActor,
      movieImage,
      movieDuration,
      movieRelease,
      trailer,
      language,
      country,
      movieType,
    } = req.body;
    try {
      const movieResult = await Movie.findAll({
        where: {
          movieName: movieName,
        },
      });
      if (movieResult.length !== 0) {
        return res.status(405).json({ message: "Phim đã được tạo" });
      } else {
        const newMovie = await Movie.create({
          movieName,
          movieCategory,
          movieDescription,
          movieDirector,
          movieActor,
          movieImage,
          movieDuration,
          movieRelease,
          trailer,
          language,
          country,
        });
        for (const movieTypeId of movieType) {
          const currMovieType = await MovieType.findOne({
            where: {
              movieTypeId: movieTypeId,
            },
          });
  
          await currMovieType.addMovie(newMovie);
        }
        return res.status(201).json({
          "Movie added successfully :": newMovie,
        });
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      return res.status(500).json({ error: "Could not add movie" });
    }
  };


/*
Thang
 delete a movie
*/
const deleteMovie = async (req, res) => {
    const { movieId } = req.params;
    try {
        const deletedRows = await Movie.destroy({
            where: {
                movieId: movieId
            }
        });

        if (deletedRows > 0) {
            return res.status(200).json({ message: `Movie with ID ${movieId} deleted successfully.` });
        } else {
            return res.status(404).json({ error: `Movie with ID ${movieId} not found.` });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Could not delete show.' });
    }
}

/*
Thang
Function to edit movies
*/
const updateMovie = async (req, res) => {
    const {
        movieId,
        movieName,
        movieCategory,
        movieDescription,
        movieDirector,
        movieActor,
        
        movieImage,
        movieDuration,
        movieRelease,
        trailer,
        language,
        country
    } = req.body;
    try {
        const movieToUpdate = await Movie.findOne({
            where: {
                movieId: movieId
            }
        });
        const newMovie = await Movie.update({
            movieName: movieName || movieToUpdate.movieName,
            movieCategory: movieCategory || movieToUpdate.movieCategory,
            movieDescription: movieDescription || movieToUpdate.movieDescription,
            movieDirector: movieDirector || movieToUpdate.movieDirector,
            movieActor: movieActor || movieToUpdate.movieActor,
          
            movieImage: movieImage || movieToUpdate.movieImage,
            movieDuration: movieDuration || movieToUpdate.movieDuration,
            movieRelease: movieRelease || movieToUpdate.movieRelease,
            trailer: trailer || movieToUpdate.trailer,
            language: language || movieToUpdate.language,
            country: country || movieToUpdate.country
        }, {
            where: {
                movieId: movieId,
            },
        });

        return res.status(200).json({
            message: 'Movie updated successfully'
        });
    } catch (error) {
        console.error('Error update Movie:', error);
        return res.status(500).json({ error: 'Could not update movie' });
    }
}

const searchMovies = async (req, res) => {
    const { movieName } = req.body;

    try {
        // Chuyển đổi movieName thành chữ thường
        const lowercaseMovieName = movieName.toLowerCase();

        // Tìm kiếm bộ phim với tên chứa chuỗi tương tự
        const movieResult = await Movie.findAll({
            where: {
                movieName: {
                    [Op.like]: `%${lowercaseMovieName}%`
                }
            }
        });

        if (movieResult.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        return res.status(200).json(movieResult);
    } catch (error) {
        console.error('Error searching movie:', error);
        return res.status(500).json({ error: 'Could not search movie' });
    }
}

const getAllMovieType = async (req, res, next) => {
    try {
        const allMovieType = await MovieType.findAll()

        return res.status(200).json({allMovieType})
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    printMovie,
    printDetailMovie,
    addMovie,
    deleteMovie,
    updateMovie,
    searchMovies,
    currentMovie,
    upcomingMovie,
    getAllMovieType
}