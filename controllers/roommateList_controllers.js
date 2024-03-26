const express = require("express");
const roommateListCollection = require("../models/roommateList");
const router = express.Router();

router.get("/roommateList", async (req, res) => {
  try {
    const data = await roommateListCollection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/roommateLists/:id", async (req, res) => {
  try {
    const data = await roommateListCollection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
