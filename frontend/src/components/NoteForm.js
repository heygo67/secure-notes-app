import { useState } from "react";

export default function NoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    onAdd({ title, text });
    setTitle("");
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a secure note..."
        required
      />
      <button type="submit">Encrypt & Save</button>
    </form>
  );
}
