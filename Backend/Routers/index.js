const express = require("express")
require('dotenv').config({ path: './config.env' });
const router = express.Router()

const authRoute = require("./auth")
const blogRoute = require("./blog")
const userRoute = require("./user")
const commentRoute = require("./comment")

router.use("/auth",authRoute)
router.use("/blog",blogRoute)
router.use("/user",userRoute)
router.use("/comment",commentRoute)


module.exports = router