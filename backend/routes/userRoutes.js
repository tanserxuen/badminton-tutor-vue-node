const express = require("express");
const router = express.Router();
// const fileupload = require("express-fileupload");
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  uploadBytes,
} = require("firebase/storage");

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
    // res.send(req.files)
    // if (!req.files) {
    //   res.send("File was not found");
    //   return;
    // }
    // const image = req.files?.image;
    // const metadata = {
    //   contentType: image?.mimetype,
    // };

    // const storageRef = ref(storage, "Posts/" + image?.name);
    // storageRef.putString(image, 'data_url').then((snapshot) => {
    //   console.log('Uploaded a data_url string!');
    // });
    // let imagePath = null;

    // await uploadBytes(storageRef, image, metadata);
    // imagePath = await getDownloadURL(storageRef);

    const userRef = await db.collection("user").doc(id).update({
      name,
      description,
      linkedin,
      facebook,
      instagram,
      twitter,
      // image: imagePath,
      image
    });
    res.send(userRef);
    // res.send({imagePath});
  } catch (error) {
    res.send({error});
  }
});

module.exports = router;
