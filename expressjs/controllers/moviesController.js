
const fs = require('fs')

let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

exports.getAllMovies = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestedAt,
        count: movies.length,
        data: {
            movies: movies
        }
    })
}

exports.getMovie = (req, res) => {
    const id = +req.params.id

    let movie = movies.find(el => el.id === id)

    if(!movie) {
        return res.status(404).json({
            status: "fail",
            message: `Movie with id ${id} not found`
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            movie: movie
        }
    })
}

exports.createMovie = (req, res) => {
    // console.log(req.body)
    const newId = movies[movies.length - 1].id + 1

    const newMovie = Object.assign({id: newId}, req.body)
    movies.push(newMovie)
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                newMovie
            }
        })
    })

    // res.send('created')
}

exports.updateMovie = (req, res) => {
    const id = +req.params.id
    const updateMovie = movies.find(el => el.id === id)
    if(!updateMovie) {
        return res.status(404).json({
            status: "fail",
            message: `No movie found with id: ${id}`
        })
    }
    let index = movies.indexOf(updateMovie)

    let updatedMovie = Object.assign(updateMovie, req.body)
    movies[index] = updatedMovie

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: 'success',
            data: {
                updatedMovie
            }
        })
    })
}

exports.deleteMovie = (req, res) => {
    const id = +req.params.id
    let movieToDelete = movies.find(el => el.id === id)
    if(!movieToDelete) {
        return res.status(404).json({
            status: "fail",
            message: `No movie found with id: ${id}`
        })
    }
    const index = movies.indexOf(movieToDelete)

    movies.splice(index, 1)

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
            status: 'success',
            data: {
                movies: null
            }
        })
    })
}