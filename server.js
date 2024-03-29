const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const crypto = require("crypto");
const client = require("./client/mongo");
const userController = require("./controllers/user_controllers");
const flatListController = require("./controllers/flatList_controllers");
const roommateListController = require("./controllers/roommateList_controllers");
const wishListController = require("./controllers/wishlist_controllers");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
require("dotenv").config();

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    app.use("/", userController);
    app.use("/", flatListController);
    app.use("/", roommateListController);
    app.use("/", wishListController);

    // Generate random secret key
    const generateSecretKey = () => {
      return crypto.randomBytes(32).toString("hex"); // Generates a random 32-byte hexadecimal string
    };
    const secretKey = generateSecretKey();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
