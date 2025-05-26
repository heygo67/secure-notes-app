import NoteItem from "./NoteItem";
import { decryptNote } from "../utils/crypto";

export default function NoteList({ notes = [], onDelete, searchTerm = "" }) {
  if (!Array.isArray(notes)) {
    console.error("NoteList received invalid notes:", notes);
    return null;
  }

  const filteredNotes = notes.filter(note => {
    try {
      return decryptNote(note.title)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } catch {
      return false;
    }
  });

  return (
    <ul>
      {filteredNotes.map(note => (
        <NoteItem key={note._id} note={note} onDelete={onDelete} />
      ))}
    </ul>
  );
}

