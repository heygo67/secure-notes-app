import './App.css';
import { useState, useEffect } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import { encryptNote } from './utils/crypto';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  // Stores all notes for the current user session
  const [notes, setNotes] = useState([]);

  // Tracks whether a user is logged in (based on presence of JWT in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  // Adds an encrypted note to the temporary backend
  const addNote = async (text) => {
    if (!text.trim()) return; // Ignore empty input

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
      setNotes(prev => [...prev, newNote]); // Add to local state
    }
  };

  // Deletes a note by ID for the authenticated user
  const deleteNote = async (noteId) => {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    setNotes(prev => prev.filter(note => note._id !== noteId)); // Remove from local state
  };

  // Fetches notes when the user logs in (from in-memory store on the backend)
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
        setNotes(data); // Load into local state
      } else if (res.status === 401) {
        // Token expired or invalid; log user out
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  // Logs out the user by clearing token and state
  const handleLogout = () => {
    localStorage.removeItem("token");
    setNotes([]); // Clear local notes
    setIsAuthenticated(false);
  };

  // Render login/register view if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <h1>Secure Notes</h1>
        <p>Please log in or register to access your notes.</p>
        <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
        <RegisterForm onRegisterSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  // Render secure notes interface
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
