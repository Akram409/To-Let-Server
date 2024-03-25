const express = require("express");
const router = express.Router();
const userCollection = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const verifyToken = require("../middlewares/auth");
const { ObjectId } = require("mongodb");

// POST
router.post("/signup", async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      dob,
      bloodGroup,
      gender,
      religion,
      status,
      street,
      city,
      state,
      postalCode,
      phone,
      emergency,
      profile,
      password,
    } = req.body;
    // console.log(req.body)

    // Check if required fields are present
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    // Perform duplicate checks
    const existingUserByUsername = await userCollection.findOne({ username });
    const existingUserByEmail = await userCollection.findOne({ email });

    if (existingUserByUsername) {
      return res.status(400).json({
        error: "Username already exists. Please choose a different username.",
      });
    }

    if (existingUserByEmail) {
      return res.status(400).json({
        error:
          "An account with this email already exists. Please use a different email.",
      });
    }

    // Hash password and create new user object
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      name,
      email,
      dob,
      bloodGroup,
      gender,
      religion,
      status,
      address: {
        street,
        city,
        state,
        postalCode,
      },
      phone,
      emergency,
      profile,
      password: hashedPassword,
      calories: 0,
    };
    const data = await userCollection.insertOne(newUser);
    // console.log(newUser)

    res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to verify token
router.post("/verifyToken", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

router.post("/login", async (req, res) => {
  try {
    console.log("login route hit");
    const { email, password } = req.body;

    // Input validation:
    if (!email || !password) {
      throw new Error("Both email and password are required.");
    }

    // Search by email only:
    const user = await userCollection.findOne({ email });

    // console.log(user);
    // Handle cases where no user is found or password is incorrect:
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid email or password." });
      return; // Prevent duplicate error message in case both conditions are met
    }

    // console.log(user);

    const token = jwt.sign(
      { id: user._id, email },
      "12345fhhhfkjhfnnvjfjjfjjfjfjjfjf",
      { expiresIn: "7d" }
    );

    // console.log(token);

    res.json({ auth: true, token, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/user", async (req, res) => {
  const user = req.body;
  // console.log(user);
  const query = { email: user.email };
  const existingUser = await userCollection.findOne(query);

  if (existingUser) {
    return res.send({ message: "user is already exists" });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});

router.get("/user", async (req, res) => {
  try {
    const user = await userCollection.find().toArray();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userCollection.findOne({ email });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
