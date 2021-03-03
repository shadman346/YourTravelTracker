const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  expenditure: {
    type: Number,
  },
  location: {
    type: String,
  },
  experience: {
    type: String,
  },
});

module.exports = mongoose.model("destination", DestinationSchema);
