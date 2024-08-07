const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const apiRouter = require("./routes/api");
const apiResponse = require("./helpers/apiResponse");
const pusher = require("./helpers/pusher");
// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require("mongoose");
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
      console.log("App is running on %s\n", process.env.PORT);
      console.log("Press CTRL + C to stop the process. \n");
    }
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });
const db = mongoose.connection;

//initialize pusher
// pusher.initializePusher();

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());
app.use("/public", express.static("public"));
//Route Prefixes
app.use("/accessHubApi/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "api not found");
});

app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

module.exports = app;
