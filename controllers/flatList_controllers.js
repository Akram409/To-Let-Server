const express = require('express');
const flatListCollection = require('../models/flatList');

const router = express.Router();


router.get("/flatList", async (req, res) => {
    try {
        const { search, sort } = req.query;
        let query = {};

       
        if (search) {
            query = {
                $or: [
                    { "flatList.description.location.address": { $regex: new RegExp(search, "i") } },
                    { "flatList.description.location.city": { $regex: new RegExp(search, "i") } }
                ]
            };
        }

        // Sort 
        let sortOption = {};
        if (sort === "High To Low") {
            sortOption = { "flatList.price": -1 };
        } else if (sort === "Low To High") {
            sortOption = { "flatList.price": 1 };
        }

        const data = await flatListCollection.find(query).sort(sortOption).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/flatDetails/:id", async (req, res) => {
    try {
        const data = await flatListCollection.find().toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});



module.exports = router;