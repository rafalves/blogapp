const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')

module.exports = function (passport) {
        passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
            const user = await  User.findOne({email: email}).lean()
            if (!user) {
                return done(null, false, {message: 'This account does not exist'})
            }
            bcrypt.compare(password, user.password, (error, match) => {
                if(match) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password incorrect'})
                }
            })
        }))
    


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })
}
