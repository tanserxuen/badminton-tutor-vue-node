const express = require("express");
const router = express.Router();

router.get("/view/:id", async (req, res) => {
  try {
    const userRef = db.collection("user").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const linkedin = req.body.linkedin;
    const facebook = req.body.facebook;
    const instagram = req.body.instagram;
    const twitter = req.body.twitter;
    const image = req.body.image;
    const userRef = await db.collection("user").doc(id).update({
      name,
      description,
      linkedin,
      facebook,
      instagram,
      twitter,
      image
    });
    res.send(userRef);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
