
const fs = require('fs')
const Movie = require('./../models/movieModel')

let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

//! PARAM MIDDLEWARE
// exports.checkId = (req, res, next, value) => {

//     let movie = movies.find(el => el.id === +value)

//     if(!movie) {
//         return res.status(404).json({
//             status: "fail",
//             message: `No movie found with ID ${value}`
//         })
//     }

//     next()

// }

exports.validateBody = (req, res, next) => {
    if(!req.body.name || !req.body.releaseYear) {
        return res.status(400).json({
            status: 'fail',
            message: 'Not a valid movie data'
        })
    }
    next()
}

exports.getAllMovies = (req, res) => {

}

exports.getMovie = (req, res) => {

}

exports.createMovie = async (req, res) => {
    
    try {
        const movie = await Movie.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateMovie = (req, res) => {

}

exports.deleteMovie = (req, res) => {

}