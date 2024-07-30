
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

const PORT = 3000 || process.env.PORT
app.listen(PORT, () => {
    console.log('server has started')
})
