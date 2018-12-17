const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const query = require('../dbConnector')
const hash = require('../password/hash')

passport.use('local', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, login, password, done) {
    if (!login || !password) {
        return done(null, false, { message: 'All fields are required.' })
    }
    query(`select * from user where login='${login}'`).then(data => {
        if (data.length <= 0) return done(null, false, { message: 'Invalid login or password' });
        const dbPassword = data[0].password;
        let isPasswordMatch = hash.comparePassword(password, dbPassword)
        if (isPasswordMatch) {
            return done(null, data[0])
        } else return done(null, false, { message: 'Invalid login or password +++' });

    }).catch(err => {
        console.log(err);
        done(err)
    })

}))

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'mister cat'
},
function (jwtPayload, cb) {
    query(`select * from user where IdUser=${jwtPayload.IdUser}`).then(data => {
        return cb(null, data[0]);
    })
    .catch(err => {
        return cb(err);
    });
        
}
));


