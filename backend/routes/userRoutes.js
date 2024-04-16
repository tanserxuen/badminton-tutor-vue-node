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

router.get("/", async (req, res) => {
  try {
    const userRef = db.collection("user");
    const response = await userRef.get();
    res.send(response.docs.map((doc) => doc.data()));
  } catch (error) {
    res.send(error);
  }
});

router.post("/get-connects", async (req, res) => {
  try {
    const userRef = db.collection("user");
    const response = await userRef.doc(req.body.userId).get();
    const user = await response.data();
    const results = await Promise.all([
      userRef
        .where("id", "not-in", [
          ...user.following,
          ...user.follower,
          ...user.requests,
          ...user.requesting,
          user.id, //exclude the current user
        ])
        .get(), //get other available connects
      user.following.length
        ? userRef.where("id", "in", user.following).get()
        : [],
      user.follower.length
        ? userRef.where("id", "in", user.follower).get()
        : [],
      user.requests.length
        ? userRef.where("id", "in", user.requests).get()
        : [],
      user.requesting.length
        ? userRef.where("id", "in", user.requesting).get()
        : [],
    ]);
    res.send({
      connect: results[0]?.docs?.map((doc) => doc.data()) ?? [],
      following: results[1]?.docs?.map((doc) => doc.data()) ?? [],
      follower: results[2]?.docs?.map((doc) => doc.data()) ?? [],
      requests: results[3]?.docs?.map((doc) => doc.data()) ?? [],
      requesting: results[4]?.docs?.map((doc) => doc.data()) ?? [],
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

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
