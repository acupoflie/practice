

const express = require('express');
let app = express();
const fs = require('fs')
const morgan = require('morgan')
const moviesRouter = require('./routes/moviesRouter')

app.use(express.json())
app.use(morgan('dev'))
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

// ROUTE HANDLER FUNCTIONS

// app.get('/api/v1/movies', getAllMovies)
// app.get('/api/v1/movies/:id', getMovie)
// app.post('/api/v1/movies', createMovie)
// app.patch('/api/v1/movies/:id', updateMovie);
// app.delete('/api/v1/movies/:id', deleteMovie);

app.use('/api/v1/movies', moviesRouter)

module.exports = app















/* 
object -> json / json.parse
json -> object / json.stringify
*/









