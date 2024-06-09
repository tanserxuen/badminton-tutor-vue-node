const { initializeApp } = require("firebase/app");
const firebaseConfig = require("./firebaseConfig");
const { getAuth } = require("firebase/auth");
const { getStorage } = require("firebase/storage");

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

global.auth = auth;
global.storage = getStorage();
