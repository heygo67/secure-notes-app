import './App.css';
import { useState, useEffect } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import { encryptNote } from './utils/crypto';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [notes, setNotes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  const addNote = async (text) => {
    const token = localStorage.getItem("token");
    const encrypted = encryptNote(text);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ encrypted }),
    });

    if (res.ok) {
      const newNote = await res.json();
      setNotes(prev => [...prev, newNote]);
    }
  };

  const deleteNote = async (noteId) => {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    setNotes(prev => prev.filter(note => note._id !== noteId));
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);  // re-fetch notes when a user logs in

  const handleLogout = () => {
    localStorage.removeItem("token");
    setNotes([]);  // clear notes when logging out
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Secure Notes</h1>
        <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
        <RegisterForm onRegisterSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div>
      <h1>Secure Notes</h1>
      <NoteForm onAdd={addNote} />
      <NoteList notes={notes} onDelete={deleteNote} />
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default App;
