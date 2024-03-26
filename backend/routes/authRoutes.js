//
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://badmintonposecounter-default-rtdb.firebaseio.com",
  projectId: "badmintonposecounter",
  storageBucket: "badmintonposecounter.appspot.com",
  messagingSenderId: "1083314634615",
  appId: "1:1083314634615:web:df7a622543dad315d26b72",
  measurementId: "G-X3X9RWL768"
};

const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase/app");
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    res.send(auth);
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
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    await signOut(auth);
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
