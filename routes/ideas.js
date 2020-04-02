let express = require('express')
let mongoose = require('mongoose')
let router = express.Router()
let {ensureAuthenticated} = require('../helpers/auth')

//setting up mongoose
require('../models/Idea')
let Idea = mongoose.model('ideas')

//add idea form
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('ideas/add')

})

//edit idea form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_message', 'Not Authorised')
            res.redirect('/ideas')
        }else{
            res.render('ideas/edit', {
                idea:idea
            })
        }
    })

})


//Process idea form
router.post('/', ensureAuthenticated, function(req, res){
    let errors = []

    if(!req.body.title){
        errors.push({text:'please add a title'})
    }

    if(!req.body.details){
        errors.push({text:'Please add details'})
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        let newUser = {
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        }
        new Idea(newUser).save().then(function(idea){
            req.flash('success_msg', 'New idea added successfully')
            res.redirect('/ideas')

        })
    }
})


//Ideas index page
router.get('/', ensureAuthenticated, function(req, res){
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(function(ideas){
        res.render('ideas/index', {ideas:ideas})
    })
}) 

// update idea form
router.put('/:id', ensureAuthenticated, function(req, res){
    Idea.findOne({
        _id:req.params.id
    })
    .then(function(idea){
        // add new values
        idea.title = req.body.title
        idea.details = req.body.details

        idea.save()
        .then(function(idea){
            res.redirect('/ideas')
        })
    })
})

//delete request
router.delete('/:id', ensureAuthenticated, function(req, res){
    Idea.remove({
        _id:req.params.id
    })
    .then(function(){
        req.flash('success_msg', 'idea successfully removed')
        res.redirect('/ideas')
    })
})

module.exports = router