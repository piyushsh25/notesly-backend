const mongoose = require('mongoose')
const { Schema } = mongoose
const notesSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        noteId: String,
        header: String,
        content: String,
        fontFamily: String,
        backgroundColor: String,
        pinned: Boolean,
        tags: [],
        createDate: String,
        formatDate: String
    }
)
const NoteslyPosts = mongoose.model("notes", notesSchema)
const ArchivePosts = mongoose.model("archives", notesSchema)
const TrashPosts = mongoose.model("trash", notesSchema)

module.exports = { NoteslyPosts, ArchivePosts, TrashPosts }