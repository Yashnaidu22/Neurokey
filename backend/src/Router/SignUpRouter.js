const express = require("express")
const newUserModel = require("../Models/newUserModel")
const router = express.Router()
router.post("/", async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body.formData

    const Users = await newUserModel.find()
    // console.log("Users stored : ",Users)
    let out = false;
    Users.forEach(storedUser => {
        if (storedUser.email === email) {
            out = true
            res.status(200).json({ message: "User Already Exists", out: out })
            return
        }
    });
    if (!out) {
        const newUser = new newUserModel({
            email: email,
            password: password
        })
        await newUser.save()
        res.status(200).json({ message: "data recieved success", out: false })
    }

})
module.exports = router