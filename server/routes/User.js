const express = require('express')
const router = express.Router();
const expressValidator = require('express-validator')
const query = require('../dbConnector')
const hash = require('../password/hash')
const passport = require('passport')
const isAuthenticated = require('../auth/isAuthenticated')




router
    .route('/login')
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            console.log(user);
            req.login(user, err => {
                if (err) console.log(err)
                const { IdUser, login, status } = user
                res.send({ id: IdUser, login: login, status: status })
            })

        })(req, res, next)
    })




router.route('/logout').post((req, res) => {
    req.logout()
    res.send({ message: 'Success logout' })
})
router.route('/register')
    .post((req, res, next) => {
        req.check('login').len({ min: 6, max: 10 }).withMessage('Login should be greater than 6 and less then 10 symbols')
        req.check('password').isLength({ min: 4 }).withMessage('Password should be greater than 4 symbols')
        req.check('password').equals(req.body.confirmPassword).withMessage('Passwords do not match')
        let errors = req.validationErrors()

        if (errors) {
            res.status(500).send({ validationErrors: errors, message:'You have some validation errors' })
        } else {
            const { login, password, type } = req.body;
            let hashWord = hash.cryptPassword(password)
            query(`INSERT INTO user(login,password,type) values('${login}','${hashWord}','${type}')`).then(data => {
                let id = data.insertId
                let registered = data.affectedRows > 0
                if (registered) {
                    const user = { IdUser: id, login: login, password: hashWord, type: type }
                    req.login(user, (err) => {
                        res.send({ message: 'Success register you can login', auth: req.isAuthenticated() })
                    })
                }

            }).catch(err => {
                console.log(err)
            })
        }
    })

router.route('/account')
    .get(isAuthenticated, (req, res, next) => {
        if(!req.user){
            res.send({wtf: 'true'})
        }
        console.log('Requsted user: ', req.user);
        query(`select IdUser, login, type from user where IdUser='${req.user.IdUser}'`).then(data => {
            if (data.length == 0) { res.send({ err: 'No user. Account has been deleted' }) }
            else {
                console.log(data)
                const { IdUser, login, type } = data[0];
                res.send({ IdUser, login, type })
            }
        }).catch(err => {
            console.log(err)
        })

    }).put(isAuthenticated, (req, res) => {
        const { IdUser } = req.user
        console.log("Requested user: ", req.user);
        let { login, password, type } = req.body
        console.log("IdUser: ", IdUser)
        if (login == undefined) login = 'NULL'
        if (password == undefined) password = 'NULL'
        if (type == undefined) type = 'NULL'
        let sql = `update user set login = COALESCE('${login}',login), password = COALESCE('${password != 'NULL' ? hash.cryptPassword(password) : "NULL"}',password),
                   type = COALESCE('${type}',type) where IdUser='${IdUser}'`
            .replace(/''/g, "'")
            .replace(/'NULL'/g, "NULL")
        query(sql).then(data => {
            res.send({ updated: data.affectedRows > 0 })
        })
    })

module.exports = router;