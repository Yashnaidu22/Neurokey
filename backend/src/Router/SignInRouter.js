const express = require("express")
const router = express.Router()
const updateCsvFile = require("../assets/updateCsvFile")
const BackendToPythonConnection = require("../assets/backendToPythonConnection")
const newUserModel = require("../Models/newUserModel")
const existingUserModel = require("../Models/existingUserModel")

router.post("/", async (req, res) => {
    const { dwellTime, flightTime, interKeyInterval } = req.body;
    const newUsers = await newUserModel.find()
    let matchFound = false;
    for (const element of newUsers) {
        if (element.email === req.body.formData.email && element.password === req.body.formData.password) {
            const userId = element._id;
            const existingUsers = await existingUserModel.find();
            const existingValidUsers = existingUsers.filter(u => u.userId == userId);

            if (existingValidUsers.length === 0) {
                const newExistingUser = new existingUserModel({
                    userId,
                    dwellTime: dwellTime,
                    flightTime: flightTime,
                    interKeyTime: interKeyInterval,  // also fix field name here
                    target: 1 // Assuming '1' indicates a valid entry
                });
                await newExistingUser.save();
                return res.status(200).json({ message: "Sign In Success", out: true });
            } else {
                // ML Model Code Here
                // const upadteCsvObj = new updateCsvFile();
                // await upadteCsvObj.exportUserDataToCsv(existingValidUsers);
                // Call Python Script Here
                const obj = new BackendToPythonConnection();
                const pythonResponse = await obj.runPythonScript({"dwell":dwellTime,"flight":flightTime,"interKey":interKeyInterval});
                console.log("Python Response&&&&&&&&&&&&&&&&&&&&&&&: ", pythonResponse);
                const targetValue = pythonResponse["result"]["prediction"];
                const newExistingUser = new existingUserModel({
                    userId,
                    dwellTime: dwellTime,
                    flightTime: flightTime,
                    interKeyTime: interKeyInterval,  // also fix field name here
                    target: targetValue // Assuming '1' indicates a valid entry
                });
                await newExistingUser.save();
                if(pythonResponse["result"]["prediction"]){
                    return res.status(200).json({ message: "Sign In Success", out: true });
                }
                else{
                    return res.status(200).json({ message: "Invalid Credentials", out: false });
                }
            }
        }
    }
    return res.status(200).json({ message: "Invalid Credentials", out: false });

})

module.exports = router