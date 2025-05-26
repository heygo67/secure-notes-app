import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();

const app = express();
app.use(helmet());

// CORS for local or deployed frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000"
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log("Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
