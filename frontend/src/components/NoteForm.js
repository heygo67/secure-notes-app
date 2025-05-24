import { useState } from "react";

export default function NoteForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);  // Encrypts + sends note via parent handler
    setText("");  // Clear form after submission
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2em" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a secure note..."
        rows={4}
        style={{
          width: "100%",
          padding: "1em",
          borderRadius: "6px",
          border: "1px solid #ccc",
          resize: "vertical",
          fontFamily: "inherit",
          fontSize: "1em"
        }}
        aria-label="Secure note input"
      />
      <br />
      <button
        type="submit"
        disabled={!text.trim()}
        style={{
          marginTop: "0.5em",
          padding: "0.5em 1em",
          backgroundColor: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Encrypt & Save
      </button>
    </form>
  );
}
