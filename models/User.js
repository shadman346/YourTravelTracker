const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    Unique: true,
  },
  image: {
    type: String,
  },
  destination: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "destination",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
