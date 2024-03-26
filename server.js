const express = require("express");
// const bodyParser = require('body-parser');
// const authRouter = require('./backend/middleware/auth');
const cors = require("cors");

//import the 'routes' file
var indexRouter = require("./backend/routes");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*", // Replace with your Vue.js client's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
// app.use('/auth', authRouter);
app.use("/", indexRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));

// module.exports = app;
