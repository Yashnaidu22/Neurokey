const express = require("express")
const app = express()
const cors = require("cors")
// require("dotenv").config()
const signInRouter = require("./Router/signInRouter")
const signUpRouter = require("./Router/SignUpRouter")

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use("/signUp",signUpRouter)
app.use("/signIn",signInRouter)
module.exports = app