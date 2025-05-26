// In-memory store (temporary demo-only)
const notes = [];

/**
 * Create a new note and store it in memory.
 * @param {Object} params - Note data
 * @param {string} params.userId - The ID of the user creating the note
 * @param {string} params.title - Encrypted title of the note
 * @param {string} params.encrypted - Encrypted content of the note
 * @returns {Object} The created note object
 */
export function createNote({ userId, title, encrypted }) {
  if (!userId || !title || !encrypted) {
    throw new Error("Missing required fields to create a note");
  }

  const note = {
    _id: Date.now().toString(), // Simulated unique ID
    userId,
    title,        // Encrypted title string
    encrypted,    // Encrypted body string
    timestamp: new Date()
  };

  notes.push(note);
  return note;
}

/**
 * Retrieve all notes created by a specific user.
 * @param {string} userId - The ID of the user
 * @returns {Array} Array of that user's notes
 */
export function getNotesByUser(userId) {
  return notes.filter(note => note.userId === userId);
}

/**
 * Delete a note by ID if it belongs to the given user.
 * @param {string} userId - The ID of the user
 * @param {string} noteId - The ID of the note
 * @returns {boolean} True if deleted, false otherwise
 */
export function deleteNoteById(userId, noteId) {
  const index = notes.findIndex(note => note._id === noteId && note.userId === userId);
  if (index !== -1) {
    notes.splice(index, 1);
    return true;
  }
  return false;
}
