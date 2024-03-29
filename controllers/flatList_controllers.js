const express = require("express");
const UPLOAD_FOLDER = "./public/image";
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const flatListCollection = require("../models/flatList");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    if (file) {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      console.log("🚀 ~ fileName:", fileName);
      cb(null, fileName + fileExt);
    }
  },
});

var upload = multer({
  storage: storage,
});

router.get("/flatList", async (req, res) => {
  try {
    const data = await flatListCollection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/add/flatList", upload.array("images", 10), async (req, res) => {
    try {
      // console.log("🚀 ~ router.post ~ req.body:", req.body); // This should contain userEmail and userId
    //   console.log("🚀 ~ router.post ~ req.files:", req.files); // This should contain uploaded files
  
      // Access userEmail and userId from req.body
      const {
        userEmail,
        userId,
        type,
        availableFrom,
        bedroom,
        bathroom,
        size,
        rent,
        address,
        city,
        postalCode,
        phone,
        firstName,
        lastName,
        userCity,
        userPostalCode,
      } = req.body;
  
      // Map filenames from req.files
    //   const filenames = req.files.map((file) => file.filename)
    //   console.log("🚀 ~ router.post ~ filenames:", filenames);
  
      // Create newFlatList object
      const newFlatList = {
        userEmail,
        userId,
        flatList: {
          description: {
            type,
            bedroom,
            bathroom,
            size,
            rent,
            availableFrom,
            location: {
              address,
              city,
              postalCode,
            },
          },
          images: req.files.map((file) => file.filename), // Use filenames obtained from req.files
          contact_person: {
            firstName,
            lastName,
            userCity,
            userPostalCode,
            phone,
          },
        },
      };
  
      // Insert newFlatList into the database
      await flatListCollection.insertOne(newFlatList);
  
      // Send a success response
      res.status(201).json({ message: "Flat list data added successfully." });
    } catch (error) {
      console.error("Error:", error);
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
