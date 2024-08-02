
const fs = require('fs')
const Movie = require('./../models/movieModel')
const { query } = require('express')
const ApiFeatures = require('../utils/ApiFeatures')

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
    if (!req.body.name || !req.body.releaseYear) {
        return res.status(400).json({
            status: 'fail',
            message: 'Not a valid movie data'
        })
    }
    next()
}

exports.getHighestRated = (req, res, next) => {
    req.query.limit = '2'
    req.query.sort = '-ratings'
    next()
}

exports.getAllMovies = async (req, res) => {
    try {
        console.log(req.query)

        const features = new ApiFeatures(Movie.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const movies = await features.query;

        //! EXCLUDING FIELDS AFTER MONGODB 7.0 ???
        // const excludeField = ['sort', 'page', 'limit', 'fields']
        // const queryObj = {...req.query}
        // excludeField.forEach((field) => {
        //     delete queryObj[field]
        // })

        // let query = Movie.find(queryObj)

        // const movies = await Movie.find()
        //                     .where('duration')
        //                     .equals(req.query.duration)
        //                     .where('ratings')
        //                     .equals(req.query.ratings)

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getMovieStats = async (req, res) => {
    try {
        const stats = await Movie.aggregate([
            { $match: {ratings: {$gte: 5}} },
            { $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                totalPrice: { $sum: '$price' },
                movieCount: { $sum: 1 }
            } },
            { $sort: {_id: 1}},
            { $match: {maxPrice: {$gte: 9}} }
        ]);

        res.status(200).json({
            status: 'success',
            length: stats.length,
            data: {
                stats
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}