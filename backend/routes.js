const express = require("express");
const AuthRoutes = require("./routes/authRoutes");
const UserRoutes = require("./routes/userRoutes");
const PostRoutes = require("./routes/postRoutes");
const FeedbackRoutes = require("./routes/feedbackRoutes");
const TutorialRoutes = require("./routes/tutorialRoutes");
const AnalyticsRoutes = require("./routes/analyticsRoutes");

var router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/post", PostRoutes);
router.use("/feedback", FeedbackRoutes);
router.use("/tutorials", TutorialRoutes);
router.use("/analytics", AnalyticsRoutes);

module.exports = router;
