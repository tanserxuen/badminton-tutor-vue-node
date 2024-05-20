const express = require("express");
const router = express.Router();
const movementAccuracyJson = require("../config/movementAccuracy.json");

router.post("/update-movement-accuracy", async (req, res) => {
  try {
    const analyticsRef = db
      .collection("user")
      .doc(global.currentUser?.uid ?? "1dEfksfsENPMoTGarpVQ8lL4Xov2");
    analyticsRef
      .update({
        movementAccuracyObj: req.body.movingAccuracyObj ?? movementAccuracyJson,
      })
      .then((doc) => {
        res.send(doc);
      })
      .catch((error) => {
        console.log("error", error);
        res.send(error);
      });
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const analyticsRef = db
      .collection("user")
      .doc(global.currentUser.uid)
      .get();
    analyticsRef.then((doc) => {
      if (doc.exists) {
        res.send(doc.data());
      } else {
        res.status(500).send("No such document!");
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
