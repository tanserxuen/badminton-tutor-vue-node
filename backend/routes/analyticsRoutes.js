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
        movementAccuracyObj: req.body.averageAccuracy ?? movementAccuracyJson,
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

// router.post("/update-growth", async (req, res) => {
//   try {
//     const analyticsRef = db
//       .collection("user")
//       .doc(global.currentUser?.uid ?? "1dEfksfsENPMoTGarpVQ8lL4Xov2");
//     const analytics = await analyticsRef.get();
//     const oldMovementAccuracyObj = analytics.data().movementAccuracyObj;
//     const newMovementAccuracyObj = req.body.movingAccuracyObj;
//     //growth is to take the object and compare the values of the two objects
//     const growth = oldMovementAccuracyObj.reduce((acc, key) => {
//       const growth = newMovementAccuracyObj[key] - oldMovementAccuracyObj[key];
//       acc[key] = growth;
//       return acc;
//     }, {});
//     console.log(growth)

//     analyticsRef
//       .update({
//         performance,
//       })
//       .then((doc) => {
//         res.send(doc);
//       })
//       .catch((error) => {
//         console.log("error", error);
//         res.send(error);
//       });
//   } catch (error) {
//     console.log("error", error);
//     res.send(error);
//   }
// });

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
