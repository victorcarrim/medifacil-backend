require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./index");
const initializeUser = require("./config/initializeUser.config");

mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000
    })
    .then(async () => {
      console.log("Connected to MongoDB");
      app.listen(5000)
      await initializeUser();
    })
    .catch((err) => {
      console.log("Error: ", err);
    });

module.exports = app;
