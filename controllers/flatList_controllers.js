const express = require('express');
const flatListCollection = require('../models/flatList');

const router = express.Router();


router.get("/flatList", async (req, res) => {
    try {
        const data = await flatListCollection.find().toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});


module.exports = router;