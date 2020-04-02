let mongoose = require('mongoose')

let Schema = mongoose.Schema

//create Schema
let IdeaSchema = new Schema({
title:{
    type: String,
    required: true
},
details:{
    type: String,
    required: true
},
user:{
    type: String,
    required: true
},
date:{
    type:Date,
    default: Date.now
}
})

mongoose.model('ideas', IdeaSchema)