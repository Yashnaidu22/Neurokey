// const express = require(express)
const mongoose = require("mongoose")
const existingUserSchema = new mongoose.Schema({
    userId : {
        type : String 
    },
    dwellTime :{
        type : Number
    },
    flightTime :{
        type : Number
    },
    interKeyTime :{
        type : Number
    },
    target : {
        type : Number,
    }
})
const existingUserModel = mongoose.model("existingUser",existingUserSchema)

module.exports = existingUserModel