import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET not configured" });
  }

  const { email, password } = req.body;
  try {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ email, hashedPassword });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET not configured" });
  }

  const { email, password } = req.body;
  try {
    const user = findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
