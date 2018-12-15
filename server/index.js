
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const passport = require('passport')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const redis = require('redis')
const client = redis.createClient()
const expressValidator = require('express-validator')

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const query = require('./dbConnector')


const io = require('socket.io')(server)
const redisAsyncSet = require('util').promisify(client.set).bind(client)
const redisAsyncGet = require('util').promisify(client.get).bind(client)




const setFurnitureHeight = async (IdRoom, IdFurniture, height) => {
    const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncSet(key, height.toString())

}

const getFurnitureHeight = async (IdRoom, IdFurniture) => {
    const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncGet(key)
}

io.on('connection', socket => {
    socket.emit('hello')
    console.log("hello " + socket.id);
    socket.on("set_height", (data) => {
        let { value } = data
        setFurnitureHeight(10, 10, value).then(res => {
            console.log(res)
        })
    })
    socket.on("ping_get_height", () => {
       // console.log("pinged");
        getFurnitureHeight(10, 10).then(data => {
            let value = data
            socket.emit("get_height", { value })
        })

    })
})

app.use(cors({credentials: true, origin: true}))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())
app.use(session({
    secret: 'my secret',
    store: new redisStore({ host: 'localhost', port: 6379, client: client }),
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
const UserProfile = require('./routes/UserProfile')
app.use('/user', User)
app.use('/room', Room)
app.use('/furniture', Furniture)
app.use('/user/:IdUser?/rooms/:IdRoom?', RoomUser)
app.use('/user/profile', UserProfile)

app.get('/', (req, res) => {

    res.send({ auth: req.isAuthenticated(), userLogin: req.user ? req.user.login : 'You`re not logged in' })
})

server.listen(PORT, () => {
    console.log(`Server works on port ${PORT}`)
})