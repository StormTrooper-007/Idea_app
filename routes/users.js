const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()


//load User model
require('../models/User') 
let User = mongoose.model('users')

//User login Route
router.get('/login', function(req, res){
    res.render('./users/login')
})

//Register route
router.get('/register', function(req, res){
    res.render('./users/register')
})

//login form POST
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//Register form POST
router.post('/register', function(req, res){
    let errors = []

    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords do not match'})
    }

    if(req.body.password.length < 8){
        errors.push({text:'Password must not be less than 8 characters'})
    }

    if(errors.length > 0){
        res.render('./users/register', {
            errors:errors,
            name: req.body.name,
            email: req.body.email,
            password:req.body.password,
            password2: req.body.password2
        })

    }else{
        User.findOne({email:req.body.email}).then(function(user){
            if(user){
                req.flash('error_msg', 'email is already taken')
                res.redirect('/users/login')
            }else{
                let newUser = new User({
                    name: req.body.name,
                    email:req.body.email,
                    password: req.body.password
                })
        
                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, salt, function(err, hash){
                        if(err) throw err
                        newUser.password = hash
                        newUser.save().then(function(user){
                            req.flash('success_msg', 'you are now registered')
                            res.redirect('/users/login')
                        }).catch(function(err){
                            console.log(err)
                            return
                        })
                    })
                })
                console.log(newUser)
            }
        })
    }
})



//logout user

router.get('/logout', function(req, res){
    req.logout()
    req.flash('success_msg', 'you are succesfully logged out')
    res.redirect('/users/login')
})

module.exports = router