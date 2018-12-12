const express = require('express')
const query = require('../dbConnector')
const router = express.Router();
const isAuthenticated = require('../auth/isAuthenticated');


router.use(function timeLog(req, res, next) {
    console.log("Cookies: ", req.cookies)
    next();
});

router.use(isAuthenticated)


router.route('/:IdRoom?')
    .get((req, res) => {
        const { IdRoom } = req.params;
        if (!IdRoom) {
            query('select * from room').then(data => {
                res.send(data)
            })
        }
        else {
            query(`select * from room where IdRoom=${IdRoom}`).then(data => {
                res.send(data)
            }).catch(err=>{
                console.log("object");
            })
        }
    })



module.exports = router;