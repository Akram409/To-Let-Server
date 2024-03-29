const express = require("express");
const roommateListCollection = require("../models/roommateList");
const router = express.Router();

router.get("/roommateList", async (req, res) => {
  try {
      const { search, sort, gender } = req.query;
      let query = {};

     
      if (search) {
          query = {
              $or: [
                  { "roomateList.description.location.address": { $regex: new RegExp(search, "i") } },
                  { "roomateList.description.location.city": { $regex: new RegExp(search, "i") } },
                  
              ]
          };
      }

      // Filter by gender 
      if (gender) {
          query["roomateList.roomatePreferences.gender"] = gender;
      }

      // Sort by price
      let sortOption = {};
      if (sort === "High To Low") {
          sortOption = { "roomateList.price": -1 };
      } else if (sort === "Low To High") {
          sortOption = { "roomateList.price": 1 };
      }

      const data = await roommateListCollection.find(query).sort(sortOption).toArray();
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
