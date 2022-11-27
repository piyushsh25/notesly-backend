var jwt = require('jsonwebtoken');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const app = express();
const dayjs= require("dayjs");
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
const secret = process.env.TOKEN
const authVerify = (req, res, next) => {
    const token = req.headers.authorization
    try {
        const decode = jwt.verify(token, secret);
        req.user = { userId: decode.userId }
        return next();
    } catch (error) {
        res.status(401).json({ success: false, message: "unauthorized access" })
    }
}
const formatDate = () => dayjs().format("YYYY-MM-DDTHH:mm:ssZ");
module.exports = { authVerify ,formatDate}