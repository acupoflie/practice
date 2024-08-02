
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field'],
        unique: true,
        trim: true
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
        default: 1.0
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
        required: [true, 'Genre is required field']
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
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

movieSchema.virtual('durationInHours').get(function() {
    return this.duration / 60
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie