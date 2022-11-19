const port = 3000;
const express = require("express");
const app=express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const initializeDatabase = require("./db/db.connect.js");
initializeDatabase();
const notesV1=require("./routes/notes.routes")
const {authVerify}=require("./middleware/authentication")
const signup=require("./routes/signup.routes")
app.get("/", authVerify,(req, res) => {
    res.send({ success: true, message: "hi! welcome to notesly backend" })
})

app.use("/notes",notesV1)
app.use("/signup",signup)

app.get("/",(req,res)=>{
    res.send({success:true,message:"hi! welcome to notesly backend"})
})
app.use((req,res)=>{
    res.status(404).json({success:false,mesaage:"route not found"})
})
app.listen(port,()=>{
    console.log("at 3000")
})