import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI not set in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
