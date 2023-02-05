const express = require("express");
const { authVerify, formatDate } = require("../middleware/authentication");
const { ArchivePosts, NoteslyPosts } = require("../models/notes.model");
const router = express.Router();
router.route("/")
    .get(authVerify, async (req, res) => {
        try {
            // userid from authverify
            const { userId } = req.user
            //find notes by userid
            const notes = await ArchivePosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    })
router.route("/add")
    .post(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            //read note details from body.user
            const {
                noteId,  
            } = req.body.user
            //create a new note
            const findNote=await NoteslyPosts.find({noteId})
            const foundNote=findNote[0]
            //save the note
            const addToArchive=await new ArchivePosts({
                userId,
                noteId,
                header: foundNote.header,
                content: foundNote.content,
                fontFamily: foundNote.fontFamily,
                backgroundColor: foundNote.backgroundColor,
                pinned: foundNote.pinned,
                tags: foundNote.tags,
                createDate: foundNote.createDate,
                formatDate: formatDate()
            })
            const saveArchive=await addToArchive.save()
            const archiveNotes = await ArchivePosts.find({ userId })
            const deleteFromNotes = await NoteslyPosts.deleteOne({ noteId })
            const userNotes = await NoteslyPosts.find({ userId })
            res.status(200).json({ success: true, message: {archiveNotes:archiveNotes,userNotes:userNotes} })
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
            const requestedNote = await ArchivePosts.find({ noteId: id });
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
            const getNote = await ArchivePosts.find({ id })
            // userid and requirednote in one object to save it
            const condition = {
                ...getNote, ...requiredNotes, userId, formatDate: formatDate()
            }
            // update the note (selet note by note id)
            const updateNote = await ArchivePosts.findOneAndUpdate({ noteId: id }, condition)
            const notes=await ArchivePosts.find({userId})
            res.status(200).json({ success: true, message: notes })
        } catch (error) {
            res.status(404).json({ success: false, message: "error saving data" })
        }
    })
    //use add to trash route for this.
// router.route("/delete/:id")
//     .delete(authVerify, async (req, res) => {
//         try {
//             const { userId } = req.user
//             const { id } = req.params
//             // delete using noteId
//             const deleteItem = await ArchivePosts.deleteOne({ id })
//             const notes = await ArchivePosts.find({ userId })
//             res.status(200).json({ success: true, message: notes })
//         } catch {
//             res.status(404).json({ success: false, message: "error deleting data" })
//         }
//     })
router.route("/delete")
    .delete(authVerify, async (req, res) => {
        try {
            const { userId } = req.user
            // delete using noteId
            const deleteItem = await ArchivePosts.deleteMany({ userId: userId })
            const notes = await ArchivePosts.find({ userId })
            res.status(200).json({ success: true, message: notes })
        } catch {
            res.status(404).json({ success: false, message: "error deleting data" })
        }
    })
module.exports = router