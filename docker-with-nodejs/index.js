const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require('./config/config');
const postRouter = require('./routes/postRouter')
const userRouter = require('./routes/userRouter')
const session = require('express-session')
const redis = require('redis')
const cors = require('cors')

app.use(express.json())

let redisStore = require('connect-redis').default
// let redisClient = redis.createClient({
//     socket: {
//         host: REDIS_URL,
//         port: REDIS_PORT
//     }
// }).connect().then(() => console.log('bla')).catch(e => console.log(e))

const connectWithRetry = () => {
    const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    mongoose.connect(mongoURL)
        .then(() => console.log('db connection succesfull'))
        .catch(err => {
            console.log(err)
            setTimeout(connectWithRetry, 5000)
        })
}
connectWithRetry()

let redisClient;
(async () => {
    redisClient = redis.createClient({
        socket: {
            host: REDIS_URL,  // Replace with your Redis host
            port: REDIS_PORT  // Default Redis port
        }
    });

    // Connect to Redis server
    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect();
})();

app.set('trust proxy')
app.use(cors())
app.use(session({
    store: new redisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30000
    }
}))

app.get('/', (req, res) => {
    res.send('<h2>hi there...!!!</h2>')
    console.log('hello mother')
})

app.use("/posts", postRouter)
app.use("/users", userRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('server has started')
})