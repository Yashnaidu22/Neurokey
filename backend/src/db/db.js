const mongoose = require("mongoose")
require("dotenv").config()
const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("..DATABASE CONNECTED SUCCESFULLY..")
        })
        .catch((err) => {
            console.log(err)
            console.log("..ERROR OCCURED IN DATABASE CONNECTION..")
        })
}

module.exports = connect