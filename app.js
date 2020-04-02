const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')//to update list of added ideas using the put method
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')



app = express()

//load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//Passport config
require('./config/passport')(passport)

const dotenv = require('dotenv')
dotenv.config()


//override with posts having? method DELETE or methodOverride middleware
app.use(methodOverride('_method'))

//sessions middleware
app.use(session({
    secret:'warthog',
    resave: true,
    saveUninitialized: true,
}))

//passport middleware for sessions
app.use(passport.initialize())
app.use(passport.session())

//configure flash
app.use(flash())

//global variables for flash
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//handlebars middleware
app.engine('handlebars', handlebars({
    defaultlayout: 'main'}))

app.set('view engine', 'handlebars')

//setting up mongoose
require('./models/Idea')
const Idea = mongoose.model('ideas')


//database connection with mongoose
mongoose.connect(process.env.CONNECTIONSTRING, {useUnifiedTopology: true, useNewUrlParser: true})
.then(()=>{
    console.log('mongodb conneted...')})
.catch((err)=> console.log(err))

//Welcome page
app.get('/', function(req, res){
    let title = 'Welcome'
    res.render('index', {title:title})
})

//about page
app.get('/about', function(req, res){
    res.render('about')
})


//Use routes
app.use('/ideas', ideas)
app.use('/users', users)

app.listen(process.env.PORT)