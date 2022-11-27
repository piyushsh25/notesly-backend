// signup route complete
const express = require("express");
var jwt = require('jsonwebtoken');
const { formatDate } = require("../middleware/authentication");
const { NoteslyUsers } = require("../models/user.model");
const router = express.Router();
const secret = process.env.TOKEN
router.post("/", async (req, res) => {
    // get the values from frontend user object in req.body
    const {
        userID,
        username,
        firstName,
        lastName,
        password,
        bio } = req.body.user
    try {
        //added the schema of new user
        const newUser = await new NoteslyUsers({
            userId: userID,
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
            bio: bio,
            createDate:formatDate(),
            formatDate:formatDate()
        })
        // check if the username already exists
        const existingUser = await NoteslyUsers.find({ username:username });
        if (existingUser.length==0) {
            //saves the user
            const saveUser = await newUser.save()
            //generates a token with userID in it, and expires in 48hrs
            const token = jwt.sign({ userID: userID }, secret, { expiresIn: `48h` })
            // if success returns the user and the token
            res.status(200).json({ success: true, user: saveUser, token })
        }
        else {
            console.log(existingUser.length)
            return res.status(422).json({ success: false, message: "user already exists." })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})
module.exports = router