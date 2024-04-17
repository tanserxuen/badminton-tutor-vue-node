const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const postJsonTemplate = require("../config/postJson");
const { FieldValue } = require("firebase-admin/firestore");

router.get("/", async (req, res) => {
  try {
    //fetching all user posts and filter in frontend
    // const userId = req.body.userId;
    const postRef = db.collection("post");
    // .where("userId", "==", userId);
    // const postRef = db.collection("user").doc(userId).collection("post");
    const response = await postRef.get();
    res.send(response.docs.map((doc) => doc.data()));
  } catch (error) {
    res.send(error);
  }
});

// router.post("/all", async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const postRef = db.collection("post").where("userId", "!=", userId);
//     // const postRef = db.collection("user").doc(userId).collection("post");
//     const response = await postRef.get();
//     res.send(response.docs.map((doc) => doc.data()));
//   } catch (error) {
//     res.send(error);
//   }
// });

router.post("/create", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userName = req.body.userName;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const postId = uuidv4();
    const postDb = db.collection("/post");
    const postRef = postDb
      .doc(postId)
      .set({
        id: postId,
        userId,
        title,
        image,
        description,
        userName,
        created_at: FieldValue.serverTimestamp(),
        ...postJsonTemplate,
      })
      .then((response) => {
        const userRef = db.collection("user").doc(userId);
        userRef.update({
          noOfPosts: FieldValue.increment(1),
        })
        res.send(response);
      });
  } catch (error) {
    res.send(error);
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    const postRef = db.collection("post").doc(req.params.id);
    const response = await postRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const current_user_liked = req.body.current_user_liked;
    const number_of_likes = req.body.number_of_likes;
    const comments = req.body.comments;
    const postRef = db.collection("post").doc(id).update({
      title,
      description,
      image,
      current_user_liked,
      number_of_likes,
      comments,
    });
    res.send(postRef);
  } catch (error) {
    res.send(error);
  }
});

router.post("/update/:id/part", async (req, res) => {
  try {
    const id = req.params.id;
    const current_user_liked = req.body.current_user_liked;
    const number_of_likes = req.body.number_of_likes;
    const comments = req.body.comments??[];
    const postRef = db.collection("post").doc(id).update({
      current_user_liked,
      number_of_likes,
      comments,
    });
    res.send(postRef);
  } catch (error) {
    res.send(error);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const postRef = db.collection("post").doc(req.params.id).delete();
    res.send(postRef);
  } catch (error) {
    res.send;
  }
});

module.exports = router;
