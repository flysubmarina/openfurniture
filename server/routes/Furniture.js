const express = require('express')
const query = require('../dbConnector')
const router = express.Router();
const isAuthenticated = require('../auth/isAuthenticated');

router.use(isAuthenticated)

router.route('/:IdFurniture?').get((req, res) => {
    const { IdFurniture } = req.params.IdFurniture;
    if (!IdFurniture) {
        query(`select * from furniture'`).then(data => {
            res.send(data)
        })
    }
        query(`select * from furniture where IdFurniture='${IdFurniture}'`).then(data => {
            res.send(data)
        })
})

module.exports = router;