const { where } = require('sequelize');
const { Movie } = require('../database/sequelize')


/*
Thang
Print all movies in database
*/

const printMovie = async (req, res) => {
    try {
        const allMovies = await Movie.findAll()
        res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({ error: 'Movie not found' });
    }
}
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
        country
    } = req.body;
    try {
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
            country
        });

        return res.status(201).json({
            "Show added successfully :":
                newMovie
        });
    } catch (error) {
        console.error('Error adding user:', error);
        return res.status(500).json({ error: 'Could not add user' });
    }
}

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
            return res.status(200).json({ message: `Show with ID ${movieId} deleted successfully.` });
        } else {
            return res.status(404).json({ error: `Show with ID ${movieId} not found.` });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Could not delete show.' });
    }
}

/*
Thang
Function to delete multiple movies
*/
const deleteMultipleMovie = async () => {

}

/*
Thang
Function to edit movies
*/
const editMovie = async (req, res) => {
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
        const [affectedRows] = await Movie.update(
            {
                movieName: movieName,
                movieCategory: movieCategory,
                movieDescription: movieDescription,
                movieDirector: movieDirector,
                movieActor: movieActor,
                movieImage: movieImage,
                movieDuration: movieDuration,
                movieRelease: movieRelease,
                trailer: trailer,
                language: language,
                country: country
            },
            {
                where: { movieId: movieId } // Đảm bảo rằng bạn có điều kiện where
            }
        );

        if (affectedRows > 0) {
            return res.status(200).json({
                message: 'Movie updated successfully'
            });
        } else {
            return res.status(404).json({
                error: 'Movie not found'
            });
        }
    } catch (error) {
        console.error('Error updating movie:', error);
        return res.status(500).json({ error: 'Could not update movie' });
    }
}

module.exports = {
    printMovie,
    printDetailMovie,
    addMovie,
    deleteMovie,
    editMovie   
}