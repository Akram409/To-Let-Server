const express = require("express");
const wishListCollection = require("../models/wishList");
const { ObjectId } = require("mongodb");
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
      console.log(userEmail, userId, flatWishList, roommateWishList);
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


router.delete('/wishlists/:id', async (req, res) => {
  try {
      const itemId = req.params.id;
      console.log(itemId);
      const item = await wishListCollection.findOne(new ObjectId(itemId));
      if (!item) {
          return res.status(404).json({ error: 'Item not found' });
      }

      // Delete the item by specifying the filter criteria as an object
      await wishListCollection.deleteOne({ _id: new ObjectId(itemId) });
      res.json({ message: 'Item deleted successfully' });
  } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// app.delete("/conceptual/:id" , async(req, res)=>{
//   const id = req.params.id
//   console.log("deleted id", id);
//   const query ={_id : new ObjectId(id)}
//   const result = await conceptualCollection.deleteOne(query)
//   res.send(result)
// })
router.get("/wishList/:email", async (req, res) => {
  const userEmail = req.params.email;

  try {
    const wish = await wishListCollection.find({ userEmail: userEmail }).toArray();
    res.json(wish);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});



module.exports = router;
