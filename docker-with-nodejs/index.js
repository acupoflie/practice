const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
mongoose.connect(mongoURL)
    .then(() => console.log('db connection succesfull')).catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('<h2>hi there...!!!</h2>')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('server has started')
})