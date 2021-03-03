const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { colordb } = require("./color");

mongoose.connect("mongodb://localhost:27017/your-travel-tracker", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
//db.once("state",func)  once used when you want to do certian action only one time no matter how time that certain event triggers
b.on("connected", function () {
  console.log(
    colordb.connected(
      "Mongoose default connection is open to ",
      "your-travel-tracker"
    )
  );
});

db.on("error", function (err) {
  console.log(
    colordb.error("Mongoose default connection has occured " + err + " error")
  );
});

db.on("disconnected", function () {
  console.log(
    colordb.disconnected("Mongoose default connection is disconnected")
  );
});

const app = express();

app.get("/", (req, res) => {
  res.send("helloe world");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
