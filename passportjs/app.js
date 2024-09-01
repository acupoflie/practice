const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const crypt = require('crypto')
const routes = require('./routes')
const database = require('./config/database')

const MongoStore = require('connect-mongo')

const app = express()

require('dotenv').config()

const connection = mongoose.createConnection(process.env.DB_STRING)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING,
        collection: 'sessions'
    })
}))

require('./config/passport')

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next()
})

app.use(routes)

app.get('/', (req, res, next) => {
    if(req.session.viewCount) {
        req.session.viewCount++
    } else {
        req.session.viewCount = 1
    }
    res.send(`<h1>Hello mother fucker${req.session.viewCount}</h1>`)
})

app.listen(3000)