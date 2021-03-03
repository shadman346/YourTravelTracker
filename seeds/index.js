const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Destination = require("../models/destination");
const chalk = require("chalk");
const { colordb } = require("../color");

mongoose.connect("mongodb://localhost:27017/your-travel-tracker", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// const connected = chalk.bold.cyan;
// const error = chalk.bold.yellow;
// const disconnected = chalk.bold.red;
// const termination = chalk.bold.magenta;

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

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

// mongoose
//   .connect("mongodb://localhost:27017/your-travel-tracker", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MONGO connection open!!");
//   })
//   .catch((err) => {
//     console.log("OH!! no Mongo connection error!!");
//     console.log(err);
//   });

// const t1 = new Destination({
//   title: "manali suberb",
//   expenditure: 6555,
//   location: "manali,J&K",
// });
// t1.save();

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}
async function seedDb() {
  await Destination.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const rs = Math.floor(Math.random() * 10000);
    const dest = new Destination({
      title: `${sample(descriptors)} ${sample(places)}`,
      expenditure: rs,
      location: `${cities[rs % 1000].city}, ${cities[rs % 1000].state}`,
      experience:
        "Lorem ne deserunt!Quibusdam dolores vero perferendis laudantium.",
    });
    await dest.save();
  }
}

seedDb().then(() => {
  db.close(function () {
    console.log(
      colordb.termination(
        "Mongoose default connection is disconnected due to closing mongoDb connection"
      )
    );
  });
});
