import NoteItem from "./NoteItem";

export default function NoteList({ notes, onDelete }) {
  return (
    <ul>
      {notes.map((note) => (
        <NoteItem
          key={note._id}
          note={note}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
