const { error } = require("console");
const express = require("express");
var jwt = require('jsonwebtoken');
const { NoteslyUsers } = require("../models/user.model");
const router = express.Router();
const secret = process.env.TOKEN
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body.user
        // check if user exists in the db
        const [foundUser] = await NoteslyUsers.find({ username })
        // retrun 401 if it does'nt
        if (!foundUser) {
            return res.status(401).json({ success: false, message: "username doesn't exist" })
        }
        //if the userentered password === the pwd in db
        // creeate token and send success
        if (foundUser.password === password) {
            const token = jwt.sign({ userID: foundUser.userID }, secret, { expiresIn: `48h` })
            foundUser.password = undefined
            res.status(200).json({ success: true, token, foundUser })
        // return error if password incorrect
        } else {
            return res.status(401).json({ success: false, message: "incorrect password" })
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err })
    }
})
module.exports = router