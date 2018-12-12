const express = require('express')
const query = require('../dbConnector')
const router = express.Router({ mergeParams: true });
const isAuthenticated = require('../auth/isAuthenticated');

//router.use(isAuthenticated)



router.route('/').get((req, res) => {
    const { IdRoom, IdUser } = req.params
    if (!IdUser) {
        res.status(500).send({ err: 'Invalid user id' })
    } else {
        if (!IdRoom) {
            query('select * from user inner join user_room on user.IdUser=user_room.IdUser ' +
                'inner join room on user_room.IdRoom=room.IdRoom')
                .then(data => {
                    res.send(data)
                })
        } else {
            query(`select * from user inner join user_room on user.IdUser=user_room.IdUser ` +
                `inner join room on user_room.IdRoom=room.IdRoom where room.IdRoom='${IdRoom}'`)
                .then(data => {
                    res.send(data)
                })
        }
    }
})



module.exports = router;