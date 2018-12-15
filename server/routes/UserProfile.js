const express = require('express')

const router = express.Router();
const expressValidator = require('express-validator')
const redisClient = require('redis').createClient()
const query = require('../dbConnector')
const hash = require('../password/hash')
const passport = require('passport')
const isAuthenticated = require('../auth/isAuthenticated')
const redisAsyncSet = require('util').promisify(redisClient.set).bind(redisClient)
const redisAsyncGet = require('util').promisify(redisClient.get).bind(redisClient)




const setFurnitureHeight = async (IdRoom, IdFurniture, height) => {
    const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncSet(key, height.toString())

}

const getFurnitureHeight = async (IdRoom, IdFurniture) => {
    const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncGet(key)
}


redisClient.on('connect', () => {
    setFurnitureHeight(1,10,15).then(data=>{
       
    })
    getFurnitureHeight(1, 1, 100).then(data=>{
        console.log(data);
    })

})

router.use(isAuthenticated)

router
    .route('/')
    .get((req, res) => {
        const { IdFurniture } = req.body
        const { IdUser } = req.user
        if (!IdFurniture) {
            query(`select furniture.IdFurniture, user_profile.unlock, furniture.type,  user_profile.height, furniture.name, furniture.src from user 
                INNER JOIN user_profile ON user.IdUser = user_profile.IdUser 
                INNER JOIN furniture ON user_profile.IdFurniture = furniture.IdFurniture 
                where user.IdUser='${IdUser}'`).then(data => {
                    res.send(data)
                }).catch(err => { console.log(err); })
        } else {
            query(`select furniture.IdFurniture, user_profile.unlock, furniture.type,  user_profile.height, furniture.name, furniture.src from user 
                INNER JOIN user_profile ON user.IdUser = user_profile.IdUser 
                INNER JOIN furniture ON user_profile.IdFurniture = furniture.IdFurniture 
                where user.IdUser='${IdUser}' AND furniture.IdFurniture='${IdFurniture}'`).then(data => {
                    res.send(data)
                })
        }

    })
    .post((req, res) => {
        const { IdUser } = req.user
        const { IdFurniture, height } = req.body
        query(`select * from user_profile where IdUser='${IdUser}' and IdFurniture='${IdFurniture}'`).then(profiles => {
            if (profiles.length > 0) {
                res.status(409).send({ err: 'User profile already exists' })
            } else {
                query(`insert into user_profile(IdUser, IdFurniture, height) values('${IdUser}','${IdFurniture}','${height}')`).then(data => {
                    res.send({ inserted: data.affectedRows > 0 })
                })
            }
        })

    })
    .put((req, res) => {
        const { IdUser } = req.user
        const { IdFurniture, unlock, height } = req.body
        query(`select * from user_profile where IdUser='${IdUser}' and IdFurniture='${IdFurniture}'`).then(profiles => {
            if (profiles.length <= 0) {
                res.status(403).send({ err: 'Cant edit profile. Profile does not exist' })
            } else {
                query(`update user_profile set unlock='${unlock}', height='${height}' where IdUser='${IdUser}' and IdFurniture='${IdFurniture}'`).then(data => {
                    res.send({ updated: data.affectedRows > 0 })
                })
            }
        })
    })
    .delete((req, res) => {
        const { IdUser } = req.user
        const { IdFurniture } = req.body
        query(`delete from user_profile where IdUser='${IdUser}' and IdFurniture='${IdFurniture}'`).then(data => {
            res.send({ deleted: data.affectedRows > 0 })
        })
    })


module.exports = router