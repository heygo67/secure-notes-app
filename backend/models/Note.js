import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  encrypted: String,
  timestamp: Date
});

export default mongoose.model("Note", NoteSchema);

// each note linked to the authenticated user