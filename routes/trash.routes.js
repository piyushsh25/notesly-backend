const express = require("express");
const { authVerify, formatDate } = require("../middleware/authentication");
const { TrashPosts, NoteslyPosts, ArchivePosts } = require("../models/notes.model");
const router = express.Router();
router.route("/")
    .get(authVerify, async (req, res) => {
        try {
            // userid from authverify
            const { userId } = req.user
            //find notes by userid
            const notes = await TrashPosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    })
// id ===noteId
router.route("/add/:id")
    .post(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const { id } = req.params
            //read note details from body.user
            const {
                noteId,
                header,
                content,
                fontFamily,
                backgroundColor,
                pinned,
                tags
            } = req.body.user
            //create a new note
            const newNote = await new TrashPosts({
                userId: userId,
                noteId: noteId,
                header: header,
                content: content,
                fontFamily: fontFamily,
                backgroundColor: backgroundColor,
                pinned: pinned,
                tags: tags,
                createDate: formatDate(),
                formatDate: formatDate()
            })
            //save the note 
            const saveNotes = await newNote.save()
            // find the posts in trash
            const trashNotes = await TrashPosts.find({ userId })
            // delete the note by the give id [from notes or archived if any]
            const deleteFromNotes = await NoteslyPosts.deleteOne({ id })
            const deleteFromArchive = await ArchivePosts.deleteOne({ id })
            // get the notes and archived notes
            const notes = await NoteslyPosts.find({ userId })
            const archiveNotes = await ArchivePosts.find({ userId })
            res.status(200).json({ success: true, message: { notes: notes, trashNotes: trashNotes, archiveNotes: archiveNotes } })
        } catch (error) {
            res.status(404).json({ success: false, message: "error in saving data" })
        }
    })
router.route("/:id")
    .get(authVerify, async (req, res) => {
        try {
            //note id from params
            const { id } = req.params
            // find note by note id from trash posts.
            const requestedNote = await TrashPosts.find({ noteId: id });
            res.status(200).json({ success: true, message: requestedNote })
        } catch (error) {
            res.status(404).json({ success: false, message: "error in getting data" })
        }
    })
router.route("/edit/:id")
    .post(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const { id } = req.params
            // read body.user and store it
            const requiredNotes = req.body.user
            const getNotes = await TrashPosts.find({ id })
            // userid and requirednote in one object to save it
            const condition = {
                ...getNotes, ...requiredNotes, formatDate: formatDate()
            }
            // update the note (selet note by note id)
            const updateNote = await TrashPosts.findOneAndUpdate({ noteId: id }, condition)
            const notes = await TrashPosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(404).json({ success: false, message: "error saving data" })
        }
    })
router.route("/delete/:id")
    .delete(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const { id } = req.params
            // delete using noteId from trash posts
            const deleteItem = await TrashPosts.deleteOne({ id })
            const notes = await TrashPosts.find({ userId })
            res.status(200).json({ success: true, message: { trashNotes: notes } })
        } catch {
            res.status(404).json({ success: false, message: "error deleting data" })
        }
    })
router.route("/delete")
    .delete(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            // delete using noteId from trash posts
            const deleteItem = await TrashPosts.deleteMany({ userId: userId })
            const notes = await TrashPosts.find({ userId })
            res.status(200).json({ success: true, message: {trashNotes:notes} })
        } catch {
            res.status(404).json({ success: false, message: "error deleting data" })
        }
    })

module.exports = router