import { useState } from "react";
import { decryptNote } from "../utils/crypto";

export default function NoteItem({ note, onDelete }) {
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleToggle = () => {
    setIsDecrypted(prev => !prev);
  };

  return (
    <li>
      <code>{isDecrypted ? decryptNote(note.encrypted) : note.encrypted}</code>
      <div style={{ marginTop: "0.5em" }}>
        <button onClick={handleToggle}>
          {isDecrypted ? "Hide" : "Decrypt"}
        </button>
        <button onClick={() => onDelete(note._id)} style={{ marginLeft: "1em" }}>
          Delete
        </button>
      </div>
    </li>
  );
}
