const mongoose = require('mongoose')
const { Schema } = mongoose
const notesSchema = new Schema(
    {
        userId: String,
        noteId: String,
        header: String,
        content: String,
        fontFamily: String,
        backgroundColor: String,
        pinned: Boolean,
        tags: String
    }
)
const NoteslyPosts = mongoose.model("notes", notesSchema)
module.exports = { NoteslyPosts }