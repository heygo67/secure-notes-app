const notes = [];

export function createNote({ userId, encrypted }) {
  const note = {
    _id: Date.now().toString(), // mock ObjectId
    userId,
    encrypted,
    timestamp: new Date()
  };
  notes.push(note);
  return note;
}

export function getNotesByUser(userId) {
  return notes.filter(note => note.userId === userId);
}

export function deleteNoteById(userId, noteId) {
  const index = notes.findIndex(note => note._id === noteId && note.userId === userId);
  if (index !== -1) {
    notes.splice(index, 1);
    return true;
  }
  return false;
}