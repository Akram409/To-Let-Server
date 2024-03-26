const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_image: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  lastOnline: {
    type: Date,
    required: true,
  },
  onlineStatus: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
