import express from "express";
import auth from "../middleware/auth.js";
import { createNote, getNotesByUser, deleteNoteById } from "../models/Note.js";

const router = express.Router();

// GET /api/notes - get all notes for the authenticated user
router.get("/", auth, (req, res) => {
  try {
    const notes = getNotesByUser(req.user._id);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error: error.message });
  }
});

// POST /api/notes - create a new note for the authenticated user
router.post("/", auth, (req, res) => {
  const { title, encrypted } = req.body;
  if (!title || !encrypted) {
    return res.status(400).json({ message: "Missing title or encrypted body" });
  }

  try {
    const note = createNote({
      userId: req.user._id,
      title,
      encrypted,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error: error.message });
  }
});



// DELETE /api/notes/:id - delete a specific note
router.delete("/:id", auth, (req, res) => {
  try {
    const success = deleteNoteById(req.user._id, req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error: error.message });
  }
});

export default router;
