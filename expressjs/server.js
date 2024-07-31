const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

mongoose.connect(process.env.CONN_STR,).then((conn) => {
    console.log('db connection succesfull')
}).catch((err) => {
    console.log('Some error has occured')
})

const PORT = 3000 || process.env.PORT
app.listen(PORT, () => {
    console.log('server has started')
})
