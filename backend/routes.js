// var express = require("express");
//include the files in routes folder
// var auth = require("./routes/authRoutes");


const express = require("express");
const AuthRoutes = require("./routes/authRoutes");
const UserRoutes = require("./routes/userRoutes");
//include firebase
// const firebase = require("firebase/app");

var router = express.Router();

router.get("/", (req, res) => res.send("hello world"));

// use the authRoutes
router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);


// this is exported to app.js in the Server folder
module.exports = router;
