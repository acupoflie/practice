
const fs = require('fs')
const Movie = require('./../models/movieModel')
const { query } = require('express')
const ApiFeatures = require('../utils/ApiFeatures')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')

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

exports.getAllMovies = asyncErrorHandler( async (req, res, next) => {
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
})

exports.getMovie = asyncErrorHandler( async (req, res, next) => {
        const movie = await Movie.findById(req.params.id)

        if(!movie) {
            const error = new CustomError('Movie with that ID is not found!', 404);
            return next(error)
        }

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        })
})

exports.createMovie = asyncErrorHandler( async (req, res, next) => {
        const movie = await Movie.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })
})

exports.updateMovie = asyncErrorHandler( async (req, res, next) => {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!movie) {
            const error = new CustomError('Movie with that ID is not found!', 404);
            return next(error)
        }

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        })
})

exports.deleteMovie = asyncErrorHandler( async (req, res, next) => {
        const movie = await Movie.findByIdAndDelete(req.params.id)
        
        if(!movie) {
            const error = new CustomError('Movie with that ID is not found!', 404);
            return next(error)
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
})

exports.getMovieStats = asyncErrorHandler( async (req, res, next) => {
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
            // { $match: {maxPrice: {$gte: 9}} }
        ]);

        res.status(200).json({
            status: 'success',
            length: stats.length,
            data: {
                stats
            }
        })
})

exports.getMovieByGenre = asyncErrorHandler( async (req, res, next) => {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {$unwind: '$genres'},
            {$group: {
                _id: '$genres',
                movieCount: {$sum: 1},
                movies: {$push: '$name'}
            }},
            {$addFields: {genre: '$_id'}},
            {$project: {_id: 0}},
            {$sort: {movieCount: 1}},
            // {$limit: 2}
            {$match: {genre: genre}}
        ])

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        })
})