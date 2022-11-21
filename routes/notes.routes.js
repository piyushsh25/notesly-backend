const express = require("express");
const { authVerify } = require("../middleware/authentication");
const { NoteslyPosts } = require("../models/notes.model");
const router = express.Router();
const { NoteslyUsers } = require("../models/user.model");
router.route("/")
    .get(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const notes = await NoteslyPosts.find({ userId })
            res.status(200).json({ success: false, message: notes })
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    })
router.route("/add")
    .post(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const {
                noteId,
                header,
                content,
                fontFamily,
                backgroundColor,
                pinned,
                tags
            } = req.body.user
            const newNote = await new NoteslyPosts({
                userId: userId,
                noteId: noteId,
                header: header,
                content: content,
                fontFamily: fontFamily,
                backgroundColor: backgroundColor,
                pinned: pinned,
                tags: tags
            })
            const saveNotes = await newNote.save()
            res.status(200).json({ success: true, message: saveNotes })
        } catch (error) {
            res.status(404).json({ success: false, message: "error in saving data" })
        }
    })
router.route("/:id")
    .get(authVerify, async (req, res) => {
        try {
            const { id } = req.params
            const requestedNote = await NoteslyPosts.find({ noteId: id });
            res.status(200).json({ success: true, message: requestedNote })
        } catch (error) {
            res.status(404).json({ success: false, message: "error in getting data" })
        }
    })
router.route("/edit/:id")
    .post(authVerify, async (req, res) => {
        try {
            console.log("hi")
            const { userId } = req.user
            const { id } = req.params
            const requiredNotes = req.body.user
            const condition = {
                ...requiredNotes, userId
            }
            const updateNote = await NoteslyPosts.findOneAndUpdate({ noteId: id }, condition)
            res.status(200).json({ success: true, message: updateNote })
        } catch (error) {
            res.status(404).json({ success: false, message: "error saving data" })
        }
    })
module.exports = router