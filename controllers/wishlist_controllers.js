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


// ------------------Wishlist POST Route--------------------- 

router.post("/wishlist", async (req, res) => {
  try {
    const { userEmail, userId, flatWishList, roommateWishList } = req.body;

    // Create a new wishlist 
    const newWishlist = new Wishlist({
      userEmail,
      userId,
      flatWishList,
      roommateWishList
    });

    const savedWishlist = await newWishlist.save();

    res.status(201).json(savedWishlist);
  } catch (err) {
    
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
