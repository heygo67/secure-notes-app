import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/User.js";

const router = express.Router();
const crypto = await import("crypto");
const refreshTokens = {}; // In-memory store

router.post("/register", async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { email, password } = req.body;
  try {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ email, hashedPassword });

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    refreshTokens[refreshToken] = user._id;

    res.json({ token: accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { email, password } = req.body;
  try {
    const user = findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    refreshTokens[refreshToken] = user._id;

    res.json({ token: accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh Token
router.post("/refresh", (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens[refreshToken]) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const userId = refreshTokens[refreshToken];
  // Rotate token
  delete refreshTokens[refreshToken];
  const newRefreshToken = crypto.randomBytes(40).toString("hex");
  refreshTokens[newRefreshToken] = userId;

  const newAccessToken = jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: "15m" });
  res.json({ token: newAccessToken, refreshToken: newRefreshToken });
});

export default router;
