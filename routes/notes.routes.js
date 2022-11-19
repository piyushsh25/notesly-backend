const express = require("express");
const router = express.Router();
const { NoteslyPost } = require("../models/notes.model")
router.route("/")
    .get(async (req, re) => {
        const {username,password}=req.body.user;

        try {
            
        } catch(error) {
            res.status(500).json({success:false,message:error})
        }
    
    })
module.exports = router