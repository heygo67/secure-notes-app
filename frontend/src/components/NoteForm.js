import { useState } from "react";

export default function NoteForm({ onAdd }) {
    const [text, setText] = useState("")

    const handleSubmit = e => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write a secure note..."
            />
            <button type="submit">Encrypt & Save</button>
        </form>
    );
}

