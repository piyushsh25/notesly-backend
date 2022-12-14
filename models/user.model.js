const mongoose = require("mongoose")
const { Schema } = mongoose
const UserSchema = new Schema(
    {
        userId: String,
        username:String,
        firstName: String,
        lastName: String,
        email:String,
        password: String,
        bio: [],
        createDate:String,
        formatDate:String
    }
)
const NoteslyUsers=mongoose.model("Users",UserSchema)
module.exports={NoteslyUsers}