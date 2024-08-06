const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

mongoose.connect(process.env.CONN_STR,).then((conn) => {
    console.log('db connection succesfull')
})

const PORT = 3000 || process.env.PORT
const server = app.listen(PORT, () => {
    console.log('server has started')
})

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    //! proper way shut down the server
    server.close(() => {
        process.exit(1)
    })
})