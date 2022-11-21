const express = require("express");
const { authVerify } = require("../middleware/authentication");
const { NoteslyPosts } = require("../models/notes.model");
const router = express.Router();
const { NoteslyUsers } = require("../models/user.model");
router.route("/")
    .get(authVerify, async (req, res) => {
        try {
            // userid from authverify
            const { userId } = req.user
            //find notes by userid
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
                tags: tags
            })
            //save the note
            const saveNotes = await newNote.save()
            res.status(200).json({ success: true, message: saveNotes })
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
            // userid and requirednote in one object to save it
            const condition = {
                ...requiredNotes, userId
            }
            // update the note (selet note by note id)
            const updateNote = await NoteslyPosts.findOneAndUpdate({ noteId: id }, condition)
            res.status(200).json({ success: true, message: updateNote })
        } catch (error) {
            res.status(404).json({ success: false, message: "error saving data" })
        }
    })
router.route("delete/:id")
    .delete(authVerify,async(req,res)=>{
        try{
            const {userId}=req.user
            const {id}=req.params
            // delete using noteId
            const deleteItem=await NoteslyPosts.deleteOne({id})
            res.status(200).json({ success: true, message: deleteItem })            
        }catch{
            res.status(404).json({ success: false, message: "error deleting data" })
        }
    })
module.exports = router