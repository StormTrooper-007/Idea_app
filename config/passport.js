const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//load model
const User = mongoose.model('users')

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email,
         password, done) => {
             //match User
             User.findOne({
                 email:email
                }).then(function(user){
                    if(!user){
                        return done(null, false, {message: 'No user found'})
                    }
                    //match password
                    bcrypt.compare(password, user.password, function(error, isMatch){
                        if(error) throw error
                        if(isMatch){
                            return done(null, user)
                        }else{
                            return done(null, false, {message: 'Password incorrect'})
                        }

                    })

                })
    }))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}