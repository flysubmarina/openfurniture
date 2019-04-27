const express = require('express')
const query = require('../dbConnector')
const router = express.Router({ mergeParams: true });

router.route('/')
    .get((req, res) => {
        const { IdUser } = req.user
        query(`select * from user inner join user_room on user.IdUser=user_room.IdUser ` +
            `inner join room on user_room.IdRoom=room.IdRoom inner join room_furniture on room.IdRoom=room_furniture.IdRoom
                    inner join furniture on room_furniture.IdFurniture=furniture.IdFurniture where user.IdUser='${IdUser}'`)
            .then(data => {
                if (data.length == 0) res.send({ err: 'User do not live in any room right now' })
                else {
                    //   const { login, type, IdRoom, IdUser, num } = data[0];
                    console.log(data);
                    res.send(data)
                }
            })
    }).post((req, res) => {
        const { IdUser } = req.user;
        const { IdRoom } = req.body;
        if (!IdUser || !IdRoom) {
            res.status(500).send({ err: 'Invalid data' })
        } else {
            query(`select * from user_room where IdUser='${IdUser}' and IdRoom='${IdRoom}'`).then(data => {
                if (data.length > 0) {
                    res.status(500).send({ err: 'User already have this room' })
                } else {
                    query(`insert into user_room(IdUser, IdRoom) values('${IdUser}','${IdRoom}')`).then(result => {
                        res.send({ inserted: result.affectedRows > 0 })
                    })
                }
            })
        }
    }).put((req, res) => {
        const { IdRoom, IdUser, newIdRoom } = req.params
        if (!IdUser || !IdRoom || !newIdRoom) {
            res.status(500).send({ err: 'Invalid data' })
        } else {
            query(`select * from user_room where IdUser='${IdUser}' and IdRoom='${IdRoom}'`).then(data => {
                if (data.length > 0) {
                    res.status(500).send({ err: 'User already have this room' })
                } else {
                    query(`update user_room set IdRoom='${newIdRoom}' where IdRoom='${IdRoom}' and IdUser='${IdUser}'`).then(result => {
                        res.send({ updated: result.affectedRows > 0 })
                    })
                }
            })
        }

    }).delete((req, res) => {
        const {  IdUser } = req.user;
        const {IdRoom} = req.body;
        if (!IdUser || !IdRoom) {
            res.status(500).send({ err: 'Invalid data' })
        } else {
            query(`delete from user_room where IdUser='${IdUser}' and IdRoom='${IdRoom}'`).then(data => {
                res.send({ deleted: data.affectedRows > 0 })
            })
        }
    })



module.exports = router;