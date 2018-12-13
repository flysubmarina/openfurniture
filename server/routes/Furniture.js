const express = require('express')
const query = require('../dbConnector')
const router = express.Router();
const isAuthenticated = require('../auth/isAuthenticated');

//router.use(isAuthenticated)

router
    .route('/:IdFurniture?')
    .get((req, res) => {
        const { IdFurniture } = req.params;
        if (!IdFurniture) {
            query(`select * from furniture`).then(data => {
                res.send(data)
            })
        } else {
            query(`select * from furniture where IdFurniture='${IdFurniture}'`).then(data => {
                res.send(data)
            })
        }

    }).post((req, res) => {
        const { name, type, src } = req.body;
        query(`insert into furniture(name,type,src) values('${name}','${type}','${src}')`).then(data => {
            res.send(data)
        })
    }).delete((req, res) => {
        const { IdFurniture } = req.body;
        if (IdFurniture) {
            query(`delete from furniture where IdFurniture='${IdFurniture}'`).then(data => {
                res.send(data)
            })
        }
    }).put((req, res) => {
        const { IdFurniture, name, type, src } = req.body;
        if (IdFurniture) {
            query(`update furniture set name='${name}', type='${type}', src='${src}' where IdFurniture='${IdFurniture}'`).then(data => {
                res.send(data)
            })
        }
    })

module.exports = router;