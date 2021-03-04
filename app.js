const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const { colordb } = require("./color");
const Destination = require("./models/destination");

const dbUrl = "your-travel-tracker";

mongoose.connect(`mongodb://localhost:27017/${dbUrl}`, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
});

const db = mongoose.connection;
//db.once("state",func)  once used when you want to do certian action only one time no matter how time that certain event triggers
db.on("connected", function () {
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/destination", async (req, res) => {
   let { isVisited = true } = req.query;
   isVisited = isVisited == "true";
   const destinations = await Destination.find({ isVisited });
   if (isVisited) res.render("visited.ejs", { destinations });
   if (!isVisited) res.render("notvisited.ejs", { destinations });
});

app.get("/destination/:id", async (req, res) => {
   const { id } = req.params;
   const destination = await Destination.findById(id);
   res.render("show.ejs", { destination });
});

app.listen(3000, () => {
   console.log("Serving on port 3000");
});
