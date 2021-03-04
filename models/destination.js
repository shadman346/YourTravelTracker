const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   images: [
      {
         type: String,
      },
   ],
   expenditure: {
      type: Number,
   },
   location: {
      type: String,
   },
   experience: {
      type: String,
   },
   isVisited: {
      type: Boolean,
   },
});

module.exports = mongoose.model("destination", DestinationSchema);
