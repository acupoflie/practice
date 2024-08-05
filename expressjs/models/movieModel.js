
const mongoose = require('mongoose')
const fs = require('fs')

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
    },
    createdBy: String
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

movieSchema.virtual('durationInHours').get(function() {
    return this.duration / 60
})

movieSchema.pre('save', function(next) {
    this.createdBy = 'SIR'
    next()
})

movieSchema.pre(/^find/, function(next) {
    this.find({releaseDate: {$lte: Date.now()}})
    this.startTime = Date.now()
    next()
})

movieSchema.post(/^find/, function(docs, next) {
    this.find({releaseDate: {$lte: Date.now()}})
    this.endTime = Date.now()

    let content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents \n`
    fs.writeFileSync('./log/log.txt', content, {flag: 'a'}, (err) => console.log(err))

    next()
})

movieSchema.post('save', function(doc, next) {
    let content = `A new movie added to db with name ${doc.name} created by ${doc.createdBy}\n`
    fs.writeFileSync('./log/log.txt', content, {flag: 'a'}, (err) => console.log(err))
    next()
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie