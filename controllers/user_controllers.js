const express = require("express");
const router = express.Router();
const userCollection = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const UPLOAD_FOLDER = "./public/image";

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

// Email pass signup
router.post("/signup", upload.single("images"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      address,
      city,
      postalCode,
    } = req.body;
    const filenames = req.file.filename;
    // Check if required fields are present
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }

    // Perform duplicate checks
    const existingUserByEmail = await userCollection.findOne({ email });

    if (existingUserByEmail) {
      return res.status(400).json({
        error:
          "An account with this email already exists. Please use a different email.",
      });
    }

    // Hash password and create new user object
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      user_image: filenames,
      age,
      location: { address, city, postalCode },
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
router.get("/verifyToken", verifyToken, (req, res) => {
  // console.log("dsf",req.user)
  // { auth: true, token, email: user.email }
  res.status(200).json({ auth: true, user: req.user.user });
});

// Email pass login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
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

    const token = jwt.sign({ user }, "12345fhhhfkjhfnnvjfjjfjjfjfjjfjf", {
      expiresIn: "7d",
    });

    // console.log(token);

    res.json({ auth: true, token, user: user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// handle google login and signup
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

router.get("/users", async (req, res) => {
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

//patch
router.patch("/update/:email", upload.single("images"), async (req, res) => {
  try {
    const email = req.params.email;
    const { firstName, lastName, age, address, city, postalCode, password } =
      req.body;
    
    let userToUpdate = {location:{}};

    // Retrieve existing user data
    const existingUser = await userCollection.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update fields provided in the request body
    if (firstName) userToUpdate.firstName = firstName;
    if (lastName) userToUpdate.lastName = lastName;
    if (age) userToUpdate.age = age;
    if (address) userToUpdate.location.address = address;
    if (city) userToUpdate.location.city = city;
    if (postalCode) userToUpdate.location.postalCode = postalCode;

    // If password is provided, hash it before updating
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedPassword;
    }

    // If an image is uploaded, update the image field
    if (req.file) {
      userToUpdate.user_image = req.file.filename;
    }
    console.log(userToUpdate);
    // Update user data in the database
    const result = await userCollection.updateOne(
      { email },
      { $set: userToUpdate }
    );

    res
      .status(200)
      .json({ message: "User updated successfully", data: userToUpdate });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
