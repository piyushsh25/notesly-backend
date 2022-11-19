var jwt = require('jsonwebtoken');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
const secret=process.env.TOKEN
const authVerify=(req,res,next)=>{
    // const token=req.headers.authorization
    console.log("here")
    // console.log(token)
    req.user={user:"Piyush"}
    return next();
}
module.exports={authVerify}