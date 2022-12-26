const express = require("express");
const { formatDate, authVerify } = require("../middleware/authentication");
const { NoteslyUsers } = require("../models/user.model");
const router = express.Router();
router.route("/profile/edit/")
    .post(authVerify, async (req, res) => {
        console.log("in")
        try {
            const {
                ...params } = req.body.user
            const { userId } = req.user
            const condition = {
                userId, ...params,formatDate:formatDate()
            }
            const updateUser = await NoteslyUsers.findOneAndUpdate({ userId: userId }, condition)
            const [foundUser] = await NoteslyUsers.find({ userId: userId })
            res.status(200).json({ success: true, message: foundUser })
        } catch {
            res.status(404).json({ success: false, message: "error editing user" })

        }
    })
module.exports = router