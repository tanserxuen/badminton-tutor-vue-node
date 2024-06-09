const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
var indexRouter = require("./routes");
require("./config/firestoreSetup");
require("./config/firebaseSetup");
const fileupload = require("express-fileupload");

const app = express();
const port = 3000;

const corsOptions = {
  // origin: "*", // Replace with your Vue.js client's URL
  origin: [
    "*",
    "https://badmintontutor-backend.netlify.app",
    "https://badmintontutor.netlify.app",
    "http://localhost:8080", 
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));
app.use(fileupload({ safeFileNames: true, preserveExtension: true }));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.static(__dirname));
app.use(
  process.env.VUE_APP_MODE == "env" ? "/api" : "/.netlify/functions/router.js",
  indexRouter
);
global.currentUser = null;

app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports.handler = serverless(app);
