const mongoose = require("mongoose");
require('dotenv').config();
async function initializeDatabase() {
    const uri = process.env.MONGO_URI
    try {
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connected")
    } catch {
        console.log("not working")
    }
}
module.exports = initializeDatabase