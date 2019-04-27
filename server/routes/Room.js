const express = require('express')
const axios =  require('axios')//Old man coded 7 03 2019
const query = require('../dbConnector')
const router = express.Router();
const FurnitureController = require('../store_actions/FurnitureController')
const { setFurnitureHeight, getFurnitureHeight } = FurnitureController
router.use(function timeLog(req, res, next) {
    console.log("Body: ", req.body)
    next();
});

router.route('/setroom').post((req, res) => {
    const { IdRoom, height, unlock } = req.body;
    query(`update room_furniture set room_furniture.height='${height}', room_furniture.unlock='${unlock}' where room_furniture.IdUser='${IdRoom}'`).then(result => {
        res.send({ updated: result.affectedRows > 0 })
    })
})

router.route('/setparams').put((req, res) => {
    const { IdUser } = req.user;
    const { height } = req.body;
    query(`UPDATE
    room_furniture t1
    JOIN
    user_room t2 ON t1.IdRoom=t2.IdRoom 
SET
    t1.height='${height}'
WHERE t2.IdUser='${IdUser}'`).then(result => {
        res.send({ updated: result.affectedRows > 0 })
    })
})


const getAppropriateRooms = (req) => {
    return new Promise((resolve, reject) => {
        query(`SELECT cnt.*, MAX(cnt.count) as max FROM(SELECT usp.IdUser, br.IdRoom, usp.IdFurniture , COUNT(*) as count FROM openfurniture.user_profile usp LEFT JOIN (SELECT DISTINCT  r.IdRoom, r.num, res.IdFurniture, res.name, res.type, res.src FROM openfurniture.room r
            INNER JOIN (SELECT  rf.IdRoom, f.* FROM openfurniture.room_furniture rf INNER JOIN openfurniture.furniture f ON rf.IdFurniture = f.IdFurniture) res ON r.IdRoom = res.IdRoom
            LEFT JOIN  openfurniture.user_room ur ON res.IdRoom = ur.IdRoom
            WHERE ur.IdRoom IS NULL) br ON usp.IdFurniture = br.IdFurniture WHERE usp.IdUser=63 GROUP BY br.IdRoom) cnt`).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

const getAvailiableRooms = () => {
    return new Promise((resolve, reject) => {
        query(`SELECT r.IdRoom, r.num, res.IdFurniture, res.name, res.type, res.src FROM openfurniture.room r
        INNER JOIN (SELECT  rf.IdRoom, f.* FROM openfurniture.room_furniture rf INNER JOIN openfurniture.furniture f ON rf.IdFurniture = f.IdFurniture) res ON r.IdRoom = res.IdRoom
        LEFT JOIN  openfurniture.user_room ur ON res.IdRoom = ur.IdRoom
        WHERE ur.IdRoom IS NULL;`).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}
router.route('/setstate')
    .put((req, res) => {
        const { id, height, unlock } = req.body
        query(`update room_furniture set room_furniture.height='${height}', room_furniture.unlock='${unlock}' where room_furniture.id='${id}'`).then(result => {
            res.send(result)
            // axios.post('http://localhost:3002/setstate', { height, unlock })
            //     .then(data => {
            //         let json = CircularJSON.stringify(data.status)
            //         res.send(json)
            //     }).catch(err => {
            //         console.log(err);
            //         res.send("error")
            //     })
        })
    })

router.route('/getavailiable').get((req, res) => {
    getAvailiableRooms().then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})
router.route('/good').get((req, res) => {
    getAppropriateRooms(req).then(data => {
        res.send(data)
    }).catch(err => {
        res.send({ err: err })
    })
})


router.route('/')
    .get((req, res) => {
        query(`select * from room`).then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err)
        })
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
        const { IdRoom } = req.body
        if (IdRoom) {
            query(`delete from room where IdRoom='${IdRoom}'`).then(data => {
                res.send(data)
            })
        }
    }).put((req, res) => {
        const { IdRoom } = req.body
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






router.route('/furniture')
    .get((req, res) => {
        query(`select * from room inner join room_furniture on room.IdRoom=room_furniture.IdRoom ` +
            `inner join furniture on room_furniture.IdFurniture = furniture.IdFurniture`)
            .then(data => {
                res.send(data)
            })

    }).post((req, res) => {
        const { IdRoom } = req.body
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
    }).put((req, res) => {
        const { id, IdFurniture, IdRoom } = req.body
        if (!id) {
            res.status(500).send({ err: 'Invalid data' })
        } else {
            query(`update room_furniture set where id='${id}'`).then(data => {
                res.send({ updated: data.affectedRows > 0 })
            })
        }
    })

module.exports = router;