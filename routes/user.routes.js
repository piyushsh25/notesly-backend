const express = require("express");
var jwt = require('jsonwebtoken');
const { formatDate, authVerify } = require("../middleware/authentication");
const { NoteslyUsers } = require("../models/user.model");
const router = express.Router();
router.post("/edit", authVerify, async (req, res) => {
    try {
        const {
            ...params } = req.body.user
        const { userId } = req.user

        const condition = {
            userId, ...params
        }
        const updateUser = await NoteslyUsers.findByIdAndUpdate({ userId: userId }, condition)
        const [foundUser] = await NoteslyUsers.find({ userId: userId })
        res.status(200).json({ success: true, message: notes })
    } catch {
        res.status(404).json({ success: false, message: "error editing user" })

    }
})