const express = require("express");
const { formatDate, authVerify } = require("../middleware/authentication");
const { NoteslyUsers } = require("../models/user.model");
const router = express.Router();
router.route("/edit")
    .post(authVerify, async (req, res) => {
        try {
            const {
                ...params } = req.body.user
            const { userId } = req.user
            console.log(params)
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
module.exports = router