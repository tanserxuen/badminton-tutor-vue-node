const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();
const serviceAccount = JSON.parse(
  process.env.BADMINTONPOSECOUNTER_SERVICE_ACCOUNT
);

initializeApp({
  credential: cert(serviceAccount),
});

global.db = getFirestore();
