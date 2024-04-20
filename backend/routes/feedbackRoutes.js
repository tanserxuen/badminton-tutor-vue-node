const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const id = req.body.id;
    const feedbackRef = db.collection("feedback").where("userId", "==", id);
    const response = await feedbackRef.get();
    res.send(response.docs.map((doc) => doc.data()));
  } catch (error) {
    res.send(error);
  }
});


module.exports = router;