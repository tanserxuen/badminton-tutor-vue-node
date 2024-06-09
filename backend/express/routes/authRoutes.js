const express = require("express");
const router = express.Router();
const { FieldValue } = require("firebase-admin/firestore");
const userJsonTemplate = require("../config/userJson");
require("dotenv").config();
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  onAuthStateChanged,
} = require("firebase/auth");
const getDateDetails = require("../utils/date");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    //create user in firebase auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    //create user details in firestore
    const id = user.uid;
    const userJson = {
      id,
      email,
      password,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
      updatedDayNumber: getDateDetails(new Date()).nthDay,
      ...userJsonTemplate,
    };
    const usersDb = db.collection("user");
    const response = await usersDb.doc(id).set(userJson);
    res.send({
      user: user,
      response: response,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    global.currentUser = user;
    res.status(200).json(global.currentUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    await signOut(auth);
    global.currentUser = null;
    res.send("Logged out");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const ref = await db.collection("user").where("email", "=", email).get();
  if (ref.docs.length) {
    try {
      await sendPasswordResetEmail(auth, email);
      res.send("Password reset email sent");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(505).json("Email not found");
  }
});

router.post("/update-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    await updatePassword(auth, password);
    res.send("Password updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

// check auth token
router.get("/validate-auth", async (req, res) => {
  try {
    let user = null;
    await onAuthStateChanged(auth, (currentUser) => (user = currentUser));
    if (user) {
      global.currentUser = user;
      res.status(200).json(user);
    } else {
      global.currentUser = null;
      res.status(401).json("Unauthorized");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;