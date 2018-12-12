const http = require('http')
const localStorage = require('json-localstorage')
const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const expressValidator = require('express-validator')
const server = http.createServer(app)
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const query = require('./dbConnector')
const MemoryStore = require('memorystore')(session)
const hash = require('./password/hash')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cors())
app.use(cookieParser())
app.use(session({
    secret: 'my secret',
    store: new MemoryStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      //  expires: new Date(Date.now() + 3600000)
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



app.get('/roomfurniture/:IdRoom', (req, res) => {

    if (!req.params.IdRoom) res.status(500).send("Invalid Data")
    else {
        const { IdRoom } = req.params;
        query(`select furniture.name, furniture.type from room 
        INNER JOIN room_furniture on room.IdRoom = room_furniture.IdRoom 
        INNER JOIN furniture ON room_furniture.IdFurniture = furniture.IdFrniture;`)
            .then(data => {
                res.send(data)
            })
    }
})

app.get('/furniture/:id', (req, res) => {
    if (!req.params.id) res.status(500).send("Invalid Data")
})

app.get('/', (req, res) => {
    res.send({ auth: req.isAuthenticated(), cookie: req.cookies, session: req.session })
})

server.listen(PORT, () => {
    console.log(`Server works on port ${PORT}`)
})