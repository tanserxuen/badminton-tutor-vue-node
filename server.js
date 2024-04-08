const express = require("express");
const cors = require("cors");
var indexRouter = require("./backend/routes");
require("./backend/config/firestoreSetup");
require("./backend/config/firebaseSetup");
const fileupload = require("express-fileupload");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*", // Replace with your Vue.js client's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(fileupload({ safeFileNames: true, preserveExtension: true }));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use("/", indexRouter);
global.currentUser = null;

app.listen(port, () => console.log(`Server is running on port ${port}`));
