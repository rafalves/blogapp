const express = require('express')
const userRouter = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')

userRouter.get('/user/register', (req, res) => {
    res.render('user/register')
})

userRouter.post('/user/register', async (req, res) => {
    try {
        var errors = []
        if (!req.body.name || typeof req.body.name == undefined || req.body.name == null ) {
            errors.push({text: 'Invalid name'})
        }
        if (!req.body.email || typeof req.body.email == undefined || req.body.email == null ) {
            errors.push({text: 'Invalid email'})
        }
        if (!req.body.password || typeof req.body.password == undefined || req.body.password == null ) {
            errors.push({text: 'Invalid password'})
        }
        if (req.body.password.length < 4) {
            errors.push({text: 'Password length too short, try more 4 or more characteres'})
        }
        if (req.body.password != req.body.password2 ) {
            errors.push({text: 'Password does not match'})
        }

        if (errors.length > 0) {
            res.render('user/register', {errors: errors})
        } else {
            const user =  await User.findOne({email: req.body.email})
                if(user) {
                    req.flash('error_msg', 'Email already in use')
                    res.redirect('/user/register')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })
                    bcrypt.genSalt(10,(error, salt)=> {
                        bcrypt.hash(newUser.password, salt, async (error, hash) => {
                            if (error) {
                                req.flash('error_msg', 'Error while creating the user account...')
                                res.redirect('/')
                            }
                            newUser.password = hash
                            await newUser.save()
                            req.flash('success_msg', 'User created!')
                            res.redirect('/')
                        })
                    })
                }
        }
    } catch (err) {
        req.flash('error_msg', 'User already ')
        res.redirect('/user/register')
    }
})

userRouter.get('/login', (req, res) => {
    res.render('user/login')
})

userRouter.post('/user/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

userRouter.get('/logout', function(req, res){
    req.logout(function(err) {
    if (err) { 
        res.redirect('/');
    }
    res.redirect('/');
    });
  });

module.exports = userRouter;