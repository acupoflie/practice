

const express = require('express');
const fs = require('fs')
const morgan = require('morgan')
const moviesRouter = require('./routes/moviesRouter')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const CustomError = require('./utils/CustomError')
const globalErrorHandler = require('./controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sanitizer = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

let app = express();

app.use(helmet())

let limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "We received too many request from this IP. Try after a while."
})

app.use('/api', limiter)

app.use(express.json({limit: '10kb'}))

app.use(sanitizer())
app.use(xss())
app.use(hpp({whitelist: [
    'duration', 
    'ratings', 
    'releaseYear', 
    'releaseDate', 
    'genres', 
    'directors',
    'actors',
    'price'
]}))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})
app.use(express.static('./public'))

// ROUTE HANDLER FUNCTIONS

// app.get('/api/v1/movies', getAllMovies)
// app.get('/api/v1/movies/:id', getMovie)
// app.post('/api/v1/movies', createMovie)
// app.patch('/api/v1/movies/:id', updateMovie);
// app.delete('/api/v1/movies/:id', deleteMovie);

app.use('/api/v1/movies', moviesRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })
    //! ----
    // const err = new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status = 'fail',
    // err.statusCode = 404

    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404)

    next(err)
})

app.use(globalErrorHandler)

module.exports = app















/* 
object -> json / json.parse
json -> object / json.stringify
*/









