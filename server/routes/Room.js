const express = require('express')
const query = require('../dbConnector')
const router = express.Router();
const isAuthenticated = require('../auth/isAuthenticated');


router.use(function timeLog(req, res, next) {
    console.log("Cookies: ", req.cookies)
    next();
});

//router.use(isAuthenticated)


router.route('/:IdRoom?')
    .get((req, res) => {
        const { IdRoom } = req.params
        if (!IdRoom) {
            query('select * from room').then(data => {
                res.send(data)
            })
        }
        else {
            query(`select * from room where IdRoom='${IdRoom}'`).then(data => {
                res.send(data)
            }).catch(err => {
                console.log(err)
            })
        }
    }).post((req, res) => {
        const { num } = req.body
        query(`select * from room where num='${num}'`).then(data => {
            if (data.length > 0) {
                res.status(500).send({ err: 'Room with this num is already exist' })
            } else {
                query(`insert into room(num) values('${num}')`).then(data => {
                    res.send(data)
                }).catch(err => {

                })
            }
        })

    }).delete((req, res) => {
        const { IdRoom } = req.params
        if (IdRoom) {
            query(`delete from room where IdRoom='${IdRoom}'`).then(data => {
                res.send(data)
            })
        }
    }).put((req, res) => {
        const { IdRoom } = req.params
        const { num } = req.body
        if (IdRoom) {
            query(`select * from room where num='${num}'`).then(data => {
                if (data.length > 0) {
                    res.status(500).send({ err: 'Room with this num is already exist' })
                } else {
                    query(`update room set num='${num}' where IdRoom='${IdRoom}'`).then(data => {
                        res.send({ updated: data.affectedRows > 0 })
                    })
                }
            })
        }
    })

router.route('/:IdRoom?/furniture')
    .get((req, res) => {
        const { IdRoom } = req.params
        const { IdFurniture, id } = req.body
        if (!IdRoom || !id) {
            res.status(500).send({ err: 'Invalid room id' })
        } else {
            if (!IdFurniture) {
                query(`select * from room inner join room_furniture on room.IdRoom=room_furniture.IdRoom ` +
                    `inner join furniture on room_furniture.IdFurniture = furniture.IdFurniture where room.IdRoom='${IdRoom}'`)
                    .then(data => {
                        res.send(data)
                    })
            } else {
                query(`select * from room inner join room_furniture on room.IdRoom=room_furniture.IdRoom ` +
                    `inner join furniture on room_furniture.IdFurniture = furniture.IdFurniture where room_furniture.id='${id}'`)
                    .then(data => {
                        res.send(data)
                    })
            }
        }
    }).post((req, res) => {
        const { IdRoom } = req.params
        const { IdFurniture } = req.body
        if (!IdFurniture || !IdRoom) {
            res.status(500).send({ err: 'Invalid data' })
        } else {
            query(`insert into room_furniture(IdFurniture, IdRoom) values('${IdFurniture}','${IdRoom}')`).then(result => {
                res.send({ inserted: result.affectedRows > 0 })
            })
        }
    }).delete((req, res) => {
        const { id } = req.body
        if (!id) {
            res.status(500).send({ err: 'Invalid data' })
        } else {
            query(`delete from room_furniture where id='${id}'`).then(data => {
                res.send({ deleted: data.affectedRows > 0 })
            })
        }
    })

module.exports = router;