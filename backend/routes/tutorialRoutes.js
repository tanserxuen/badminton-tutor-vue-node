const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const tutorialJsonTemplate = require("../config/tutorialJson");
// const { uploadBytes, ref, getStorage } = require("firebase/storage");

router.get("/", async (req, res) => {
  try {
    const feedbackRef = db.collection("tutorials");
    const response = await feedbackRef.get();
    res.send(response.docs.map((doc) => doc.data()));
  } catch (error) {
    res.send(error);
  }
});

router.get("/create", async (req, res) => {
  //uploading the whole tutorial json template
  try {
    const uid = uuidv4();
    const response = await db
      .collection("tutorials")
      .doc(uid)
      .set({ id: uid, ...tutorialJsonTemplate });
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// router.post("/update/:type/:name/:img/:id", async (req, res) => {
//   //uploading image/video to the tutorial
//   try {
//     const { type, name, id, img } = req.params;
//     const image = req.body.image;
//     const tutorialRef = db.collection("tutorials").doc(id);
//     const response = tutorialRef.update({
//       [`${type}.${name}.${img}`]: image,
//     });
//     // const metadata = {
//     //   contentType: 'image/png',
//     // };
//     // const storageRef = ref(storage, "Posts/images.png")
//     // uploadBytes(storageRef, image, metadata).then((snapshot) => {
//     //   console.log('Uploaded a blob or file!');
//     //   console.log({snapshot});
//     // }).catch((error) => {
//     //   console.error(error);
//     // });
//     res.send(response);
//   } catch (error) {
//     res.send(error);
//   }
// });

module.exports = router;
