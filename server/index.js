
const express = require('express')
const fs = require('fs')
const axios = require('axios')
const app = express()
const query = require('./dbConnector')
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
const CircularJSON = require('circular-json');
app.use(cors({ credentials: true, origin: true }))
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
app.use('/room', passport.authenticate('jwt', { session: false }), Room)
app.use('/furniture', passport.authenticate('jwt', { session: false }), Furniture)
app.use('/user/rooms', passport.authenticate('jwt', { session: false }), RoomUser)
app.use('/user/profile', passport.authenticate('jwt', { session: false }), UserProfile)



clientsio.on('connection', socket => {
    console.log("hello " + socket.id);
    socket.on("set_height", (data) => {
        let { value, unlock } = data
        console.log("get new height = " + value + "unlock = " + unlock);
       
    })
})


arduinoio.on('connection', socket => {
    console.log("hello " + socket.id);

    socket.on("ping_get_height", () => {
        // console.log("pinged");

    })
})
app.post('/setroom',(req, res) => {
    const { IdRoom, height, unlock } = req.body;
    query(`update room_furniture set room_furniture.height='${height}', room_furniture.unlock='${unlock}' where room_furniture.IdRoom='${IdRoom}'`).then(result => {
        axios.post('http://localhost:3002/setstate', { height, unlock })
        .then(data => {
            let json =  CircularJSON.stringify(data.status)
            res.send(json)
        }).catch(err => {
            console.log(err);
            res.send("error")
        })
    })
})

app.post('/setstate', (req, res) => {
    console.log("object");
    const { height, unlock } = req.body
    axios.post('http://localhost:3002/setstate', { height, unlock })
        .then(data => {
            let json =  CircularJSON.stringify(data.status)
            res.send(json)
        }).catch(err => {
            console.log(err);
            res.send("error")
        })
})

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    res.send({ auth: req.isAuthenticated(), userLogin: req.user ? req.user.login : 'You`re not logged in' })
})

const { TABLES, isExist } = require('./queryHelpers/isExistInTable')


server.listen(PORT, () => {
    isExist(TABLES.USER.TABLE_NAME, TABLES.USER.FIELDS.ID_USER, 1).then(res => {
        console.log(res);
    })
    console.log(`Server works lol ${PORT}`)
})