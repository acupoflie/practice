
const mongoose = require('mongoose')
const fs = require('fs')
const validator = require('validator')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field'],
        unique: true,
        maxlength: [100, "bla bla string is > 100"],
        trim: true
        // validate: [validator.isAlpha, "Bla bla only alphabet"]
    },
    description: {
        type: String,
        required: [true, 'Description is required field'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field']
    },
    ratings: {
        type: Number,
        validate: {
            validator: function (value) {
                return value >= 1 && value <= 10
            },
            message: "Ratings ({VALUE}) should be 1 < value < 10"
        }
    },
    totalRatings: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required field']
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genres: {
        type: [String],
        required: [true, 'Genre is required field'],
        enum: {
            values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Dram", "Comedy", "Romance", "Biography", "Politic", "War"],
            message: 'Invalid genre type'
        }
    },
    directors: {
        type: [String],
        required: [true, 'Director is required field']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required field']
    },
    actors: {
        type: [String],
        required: [true, 'Actors is required field']
    },
    price: {
        type: Number,
        required: [true, 'Price is required field']
    },
    createdBy: String
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

movieSchema.virtual('durationInHours').get(function () {
    return this.duration / 60
})

//! DOCUMENT MIDDLEWARE
movieSchema.pre('save', function (next) {
    this.createdBy = 'SIR'
    next()
})

movieSchema.pre(/^find/, function (next) {
    this.find({ releaseDate: { $lte: Date.now() } })
    this.startTime = Date.now()
    next()
})

//! QUERY MIDDLEWARE
movieSchema.post(/^find/, function (docs, next) {
    this.find({ releaseDate: { $lte: Date.now() } })
    this.endTime = Date.now()

    let content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents \n`
    fs.writeFileSync('./log/log.txt', content, { flag: 'a' }, (err) => console.log(err))

    next()
})

movieSchema.post('save', function (doc, next) {
    let content = `A new movie added to db with name ${doc.name} created by ${doc.createdBy}\n`
    fs.writeFileSync('./log/log.txt', content, { flag: 'a' }, (err) => console.log(err))
    next()
})

movieSchema.pre('aggregate', function (next) {
    console.log(this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } }))
    next()
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie