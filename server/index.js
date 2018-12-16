
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const passport = require('passport')
const expressValidator = require('express-validator')
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const io = require('socket.io')(server)
const arduinoio = io.of('/arduino')
const clientsio = io.of('/clients')
const FurnitureController = require('./store_actions/FurnitureController')
const { setFurnitureHeight, getFurnitureHeight } = FurnitureController


clientsio.on('connection', socket=>{
    console.log("hello " + socket.id);
    socket.on("set_height", (data) => {
        let { value } = data
        console.log("get new height = " + value);
        setFurnitureHeight(10, 10, value).then(res => {
            arduinoio.emit('hello', data)
        })
    })
})


arduinoio.on('connection', socket => {
    console.log("hello " + socket.id);

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
app.use(passport.initialize())
app.use(passport.session())

require('./auth/passport')


const User = require('./routes/User')
const Room = require('./routes/Room')
const Furniture = require('./routes/Furniture')
const RoomUser = require('./routes/RoomUser')
const UserProfile = require('./routes/UserProfile')

app.use('/user', User)
app.use('/room',passport.authenticate('jwt', {session: false}), Room)
app.use('/furniture',passport.authenticate('jwt', {session: false}), Furniture)
app.use('/user/:IdUser?/rooms/:IdRoom?',passport.authenticate('jwt', {session: false}), RoomUser)
app.use('/user/profile',passport.authenticate('jwt', {session: false}), UserProfile)

app.get('/',passport.authenticate('jwt', {session: false}), (req, res) => {

    res.send({ auth: req.isAuthenticated(), userLogin: req.user ? req.user.login : 'You`re not logged in' })
})

server.listen(PORT, () => {
    console.log(`Server works on port ${PORT}`)
})