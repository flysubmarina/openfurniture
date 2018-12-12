const express = require('express')
const router = express.Router();
const expressValidator = require('express-validator')
const query = require('../dbConnector')
const hash = require('../password/hash')
const passport = require('passport')
const isAuthenticated = require('../auth/isAuthenticated')
router.use(function showCookie(req, res, next) {
    console.log(req.cookies)
    next();
});

router
    .route('/login')
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            console.log(user);
            req.login(user.IdUser, err => {
                if (err) console.log(err)
                const { IdUser, login, status } = user
                res.send({ id: IdUser, login: login, status: status })
            })

        })(req, res, next)
    })


router.route('/register')
    .post((req, res, next) => {
        req.check('login').len({ min: 6, max: 10 }).withMessage('Login is too short')
        req.check('password').isLength({ min: 4 }).withMessage('Password is too short')
        req.check('password').equals(req.body.confirmPassword).withMessage('Passwords do not match')
        let errors = req.validationErrors()

        if (errors) {
            res.status(500).send({ validationErrors: errors })
        } else {
            const { login, password, type } = req.body;
            let hashWord = hash.cryptPassword(password)
            query(`INSERT INTO user(login,password,type) values('${login}','${hashWord}','${type}')`).then(data => {
                const id = data.insertId;
                req.login(id, (err) => {
                    res.send({ message: 'Success register you can login', auth: req.isAuthenticated() })
                })
            }).catch(err => {
                console.log(err)
            })
        }
    })

router.route('/profile')
    .get(isAuthenticated, (req, res, next) => {
        console.log('Requsted user: ', req.user);
        query(`select IdUser, login, type from user where IdUser='${req.user.IdUser}'`).then(data => {
            if (data.length == 0) { res.status(500).send({ err: 'No user. Account has been deleted' }) }
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
        let { login, password, type } = req.body
        console.log(IdUser, login, password, type)
        if (login == undefined) login = 'NULL'
        if (password == undefined) password = 'NULL'
        if (type == undefined) type = 'NULL'
        let sql = `update user set login = COALESCE('${login}',login), password = COALESCE('${password != 'NULL' ? hash.cryptPassword(password) : "NULL"}',password), type = COALESCE('${type}',type) where IdUser='${IdUser}'`
            .replace(/''/g, "'")
            .replace(/'NULL'/g, "NULL")
        console.log(sql)
        query(sql).then(data => {
            res.send({updated: data.affectedRows > 0})
        })
    })

module.exports = router;