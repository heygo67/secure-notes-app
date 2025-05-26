import { useState } from "react";
import { decryptNote } from "../utils/crypto";
import DOMPurify from "dompurify";

export default function NoteItem({ note, onDelete }) {
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleToggle = () => {
    setIsDecrypted(prev => !prev);
  };

  const safeTitle = isDecrypted && note.title
    ? DOMPurify.sanitize(decryptNote(note.title))
    : "Encrypted Title";

  const safeBody = isDecrypted
    ? DOMPurify.sanitize(decryptNote(note.encrypted))
    : note.encrypted;

  return (
    <li className="note-card">
      <h3 className="note-title">{safeTitle}</h3>
      <pre className="note-text">{safeBody}</pre>
      <div className="note-actions">
        <button onClick={handleToggle}>
          {isDecrypted ? "Hide" : "Decrypt"}
        </button>
        <button onClick={() => onDelete(note._id)} className="delete-btn">
          Delete
        </button>
      </div>
    </li>
  );
}
