const express = require("express");
const AuthRoutes = require("./routes/authRoutes");
const UserRoutes = require("./routes/userRoutes");
const PostRoutes = require("./routes/postRoutes");
const FeedbackRoutes = require("./routes/feedbackRoutes");

var router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/post", PostRoutes);
router.use("/feedback", FeedbackRoutes);

module.exports = router;
