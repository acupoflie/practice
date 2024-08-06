

const express = require('express');
let app = express();
const fs = require('fs')
const morgan = require('morgan')
const moviesRouter = require('./routes/moviesRouter')
const authRouter = require('./routes/authRouter')
const CustomError = require('./utils/CustomError')
const globalErrorHandler = require('./controllers/errorController')

app.use(express.json())
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
app.use('/api/v1/users', authRouter)

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









