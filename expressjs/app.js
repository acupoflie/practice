

const express = require('express');
let app = express();
const fs = require('fs')
let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

app.use(express.json())

app.get('/api/v1/movies', (req, res) => {
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    })
})

app.get('/api/v1/movies/:id', (req, res) => {
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
})

app.post('/api/v1/movies', (req, res) => {
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
})

const PORT = 3000
app.listen(PORT, () => {
    console.log('server has started')
})
















/* 
object -> json / json.parse
json -> object / json.stringify
*/









