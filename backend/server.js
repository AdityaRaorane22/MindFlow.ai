const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- MONGO CONNECTION ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ---------------- USER MODEL ----------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  flowScore: Number,
  coins: Number,
  level: Number,
  streak: Number,
  totalTime: Number,
});

const User = mongoose.model("User", UserSchema);

// ---------------- SIGNUP ----------------
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPass });
    await user.save();

    return res.json({ msg: "Signup successful" });
  } catch (e) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- LOGIN ----------------
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

    return res.json({
      msg: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      }
    });
  } catch (e) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// GET LOGGED USER DETAILS
app.get("/user/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ---------------- SERVER ----------------
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
