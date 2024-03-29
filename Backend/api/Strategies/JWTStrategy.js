const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../../models/user')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_TOKEN_SECRET

passport.use(
    new JWTStrategy(opts, function (jwt_payload, done) {

        User.findOne({ _id: jwt_payload._id}, function (err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
    })
)