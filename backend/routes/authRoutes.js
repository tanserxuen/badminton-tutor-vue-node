const express = require("express");
const router = express.Router();
const { FieldValue } = require("firebase-admin/firestore");
const userJsonTemplate = require("../config/userJson");
require("dotenv").config();
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../config/firebaseConfig");
const firebaseApp = initializeApp(firebaseConfig);
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
} = require("firebase/auth");

const auth = getAuth(firebaseApp);

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
      ...userJsonTemplate,
    };
    const usersDb = db.collection("user");
    const response = await usersDb.doc(id).set(userJson);
    res.send({
      user: user,
      response: response,
    });
  } catch (error) {
    res.send(error);
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
    res.send(global.currentUser);
  } catch (error) {
    res.send(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    await signOut(auth);
    global.currentUser = null;
    res.send("Logged out");
  } catch (error) {
    res.send;
  }
});

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(auth, email);
    res.send("Password reset email sent");
  } catch (error) {
    res.send(error);
  }
});

router.post("/update-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    await updatePassword(auth, password);
    res.send("Password updated");
  } catch (error) {
    res.send(error);
  }
});

// check auth token
router.get("/validate-auth", async (req, res) => {
  try {
    const user = auth.currentUser;
    res.json(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
