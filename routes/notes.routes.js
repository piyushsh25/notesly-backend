const express = require("express");
const { authVerify, formatDate } = require("../middleware/authentication");
const { NoteslyPosts, TrashPosts, ArchivePosts } = require("../models/notes.model");
const router = express.Router();
router.route("/")
    .get(authVerify, async (req, res) => {
        try {
            // userid from authverify
            const { userId } = req.user
            //find notes by userid
            const notes = await NoteslyPosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    })
router.route("/add")
    .post(authVerify, async (req, res) => {
        try {
            const { userId } = await req.user
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
            const newNote = await new NoteslyPosts({
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
            const notes = await NoteslyPosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(404).json({ success: false, message: "error in saving data" })
        }
    })
router.route("/:id")
    .get(authVerify, async (req, res) => {
        try {
            //note id from params
            const { id } = req.params
            // find note by note id.
            const requestedNote = await NoteslyPosts.find({ noteId: id });
            if(requestedNote.length<1){
                res.status(404).json({ success: false, message: "error in getting data" })
            }
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
            //get the notes from id from database
            const getNote = await NoteslyPosts.find({ id })
            // userid and requirednote in one object to save it
            const condition = {
                ...getNote, ...requiredNotes, userId, formatDate: formatDate()
            }
            // update the note (selet note by note id)
            const updateNote = await NoteslyPosts.findOneAndUpdate({ noteId: id }, condition)
            const notes = await NoteslyPosts.find({ userId })

            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(404).json({ success: false, message: "error saving data" })
        }
    })
// move to note handler from archive and trash
router.route("/add/:id")
    .post(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const { id } = req.params
            // read body.user and store it
            const requiredNotes = req.body.user
            //get the notes from id from database

            const {
                header,
                content,
                fontFamily,
                backgroundColor,
                pinned,
                tags,
                createDate
            } = req.body.user

            // userid and requirednote in one object to save it
            const newNote = await new NoteslyPosts({
                userId: userId,
                noteId: id,
                header: header,
                content: content,
                fontFamily: fontFamily,
                backgroundColor: backgroundColor,
                pinned: pinned,
                tags: tags,
                createDate: createDate,
                formatDate: formatDate()
            })
            const saveNotes = await newNote.save()
            const deleteFromTrash = await TrashPosts.deleteOne({ id })
            const deleteFromArchive = await ArchivePosts.deleteOne({ id })

            const notes = await NoteslyPosts.find({ userId })
            const archiveNotes = await ArchivePosts.find({ userId })
            const trashNotes = await TrashPosts.find({ userId })
            res.status(200).json({ success: true, message: { notes: notes, archiveNotes: archiveNotes, trashNotes: trashNotes } })
        } catch (error) {
            res.status(404).json({ success: false, message: "error saving data" })
        }
    })
// to delete notes use add to trash route
router.route("/delete/:id")
    .delete(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            const { id } = req.params
            // delete using noteId
            const deleteItem = await NoteslyPosts.deleteOne({ id })
            const notes = await NoteslyPosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch {
            res.status(404).json({ success: false, message: "error deleting data" })
        }
    })
router.route("/delete")
    .delete(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            // delete using noteId
            const deleteItem = await NoteslyPosts.deleteMany({ userId: userId })
            const notes = await NoteslyPosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch {
            res.status(404).json({ success: false, message: "error deleting data" })
        }
    })
module.exports = router