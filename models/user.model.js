const mongoose = require("mongoose")
const { Schema } = mongoose
const UserSchema = new Schema(
    {
        userId: String,
        username:String,
        firstName: String,
        lastName: String,
        password: String,
        bio: [String]
    }
)
const NoteslyUsers=mongoose.model("Users",UserSchema)
module.exports={NoteslyUsers}