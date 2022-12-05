const port =process.env.PORT || 5000;
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const initializeDatabase = require("./db/db.connect.js");
initializeDatabase();
const notesV1 = require("./routes/notes.routes")
const { authVerify } = require("./middleware/authentication")
const signup = require("./routes/signup.routes")
const login = require("./routes/login.routes");
const archiveV1=require("./routes/archive.routes")
const trashV1=require("./routes/trash.routes")
const { NoteslyUsers } = require("./models/user.model.js");

app.use("/signup", signup)
app.use("/login", login)
app.use("/notes", notesV1)
app.use("/archive", archiveV1)
app.use("/trash", trashV1)

app.get("/", async (req, res) => {
    res.status(200).send({ success: true, mesaage: "welcome to notesly backend." })
})
app.get("/me", authVerify, async (req, res) => {
    try {
        const userId = req.user.userId
        const user = await NoteslyUsers.find({ userId })
        res.status(200).send({ success: true, user })
    } catch (error) {
        res.status(401).json({ success: false, message: "authentication failed login again" })
    }
})
app.use((req, res) => {
    res.status(404).json({ success: false, mesaage: "route not found" })
})
app.listen(port, () => {
    console.log("at 3000")
})