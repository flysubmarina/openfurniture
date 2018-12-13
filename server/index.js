const http = require('http')
const localStorage = require('json-localstorage')
const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const redis = require('redis')
const client = redis.createClient() 

const expressValidator = require('express-validator')
const server = http.createServer(app)
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const query = require('./dbConnector')
const MemoryStore = require('memorystore')(session)
const hash = require('./password/hash')
const stateStorage = require('json-localstorage')




app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cors())
app.use(cookieParser())
app.use(session({
    secret: 'my secret',
    store: new redisStore({host:'localhost', port: 6379, client: client, ttl:260}),
    resave: false,
    saveUninitialized: false,
    cookie: {
         maxAge: 3600000
    }
}))

app.use(passport.initialize())
app.use(passport.session())
require('./auth/passport')


const User = require('./routes/User')
const Room = require('./routes/Room')
const Furniture = require('./routes/Furniture')
const RoomUser = require('./routes/RoomUser')
app.use('/user', User)
app.use('/room', Room)
app.use('/furniture', Furniture)
app.use('/user/:IdUser?/rooms/:IdRoom?', RoomUser)


app.get('/', (req, res) => {
    res.send({ auth: req.isAuthenticated(), userLogin: req.user?req.user.login:'You`re not logged in' })
})

server.listen(PORT, () => {
    console.log(`Server works on port ${PORT}`)
})