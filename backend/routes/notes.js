import express from "express";
import auth from "../middleware/auth.js";
import Note from "../models/Note.js";

const router = express.Router();

// GET /api/notes - get all notes for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error: error.message });
  }
});

// POST /api/notes - create a new note for the authenticated user
router.post("/", auth, async (req, res) => {
  try {
    const note = new Note({
      userId: req.user._id,
      encrypted: req.body.encrypted,
      timestamp: Date.now()
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error: error.message });
  }
});

// DELETE /api/notes/:id - delete a specific note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error: error.message });
  }
});

export default router;
