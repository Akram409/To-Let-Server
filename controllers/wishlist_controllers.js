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

module.exports = router;
