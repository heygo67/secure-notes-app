import { useState } from "react";
import { decryptNote } from "../utils/crypto";
import DOMPurify from "dompurify";

export default function NoteItem({ note, onDelete }) {
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleToggle = () => {
    setIsDecrypted(prev => !prev);
  };

  return (
    <li style={{ marginBottom: "1.5em", listStyle: "none" }}>
      <code style={{
        display: "block",
        background: "#f4f4f4",
        padding: "1em",
        borderRadius: "6px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {isDecrypted
          ? DOMPurify.sanitize(decryptNote(note.encrypted))
          : note.encrypted}
      </code>
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
