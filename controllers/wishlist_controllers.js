const express = require("express");
const wishListCollection = require("../models/wishList");
require("dotenv").config();

const router = express.Router();

router.get("/wishList", async (req, res) => {
  try {
    const wish = await wishListCollection.find().toArray();
    res.json(wish);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/wishList", async (req, res) => {
  try {
    // Extract data from req.body
    const { userEmail, userId, flatWishList, roommateWishList } = req.body;

    // Create a new wishlist document
    const newWishList = {
      userEmail,
      userId,
      flatWishList,
      roommateWishList,
    };

    // Insert the document into the collection
    await wishListCollection.insertOne(newWishList);

    res
      .status(201)
      .json({
        message: "Wishlist created successfully",
        wishlist: newWishList,
      });
  } catch (error) {
    console.error("Error creating wishlist:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
