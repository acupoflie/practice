
const express = require('express')
const moviesController = require('../controllers/moviesController')
const authController = require('../controllers/authController')

const router = express.Router()

// router.param('id', moviesController.checkId)

router.route('/highest-rated')
    .get(moviesController.getHighestRated, moviesController.getAllMovies)

router.route('/movie-stats').get(moviesController.getMovieStats)

router.route('/movies-bygenre/:genre').get(moviesController.getMovieByGenre)

router.route('/')
    .get(authController.protect, moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router