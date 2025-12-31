// const { mongo } = require("mongoose")
const mongoose = require("mongoose")
const newUserSchema = new mongoose.Schema({
    email : {
        type : String
    },
    password : {
        type : String
    }
})

module.exports = mongoose.model("newUser",newUserSchema)