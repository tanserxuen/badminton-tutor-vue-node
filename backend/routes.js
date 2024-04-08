const express = require("express");
const AuthRoutes = require("./routes/authRoutes");
const UserRoutes = require("./routes/userRoutes");

var router = express.Router();

// router.get("/", (req, res) => res.send("hello world"));

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);

module.exports = router;
