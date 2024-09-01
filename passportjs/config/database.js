const mongoose = require('mongoose')
require('dotenv').config()

const conn = mongoose.createConnection(process.env.DB_STRING)

const userSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
})

const User = conn.model('User', userSchema)
module.exports = User