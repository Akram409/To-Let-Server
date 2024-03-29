const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  flatWishList: [
    {
      id: {
        type: String,
        required: true,
      },
    },
  ],
  roommateWishList: [
    {
      id: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("wishlist", wishListSchema);
