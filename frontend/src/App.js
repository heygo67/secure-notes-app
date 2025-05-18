import './App.css';
import { useState, useEffect } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import { encryptNote } from './utils/crypto';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });;

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  const addNote = async (text) => {
    const token = localStorage.getItem("token");
  
    const encrypted = encryptNote(text);
  
    const res = await fetch("http://localhost:5000/api/notes", {   // auth header
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ encrypted }),
    });
  
    if (res.ok) {
      const newNote = await res.json();
      setNotes((prev) => [...prev, newNote]);
    }
  };
  

  const deleteNote = async (noteId) => {
    const token = localStorage.getItem("token");
  
    await fetch(`http://localhost:5000/api/notes/${noteId}`, {   // auth header
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
  
    setNotes(prev => prev.filter(note => note._id !== noteId));
  };
  

  useEffect(() => {
    const fetchNotes = async () => {  // fetching user-specific notes
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. User may not be logged in.");  // checking user still logged in
        return;
      }

      const res = await fetch("http://localhost:5000/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,  // checking authorization w/ each API req
        },
      });
  
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        console.error("Failed to fetch notes");
      }
    };
  
    fetchNotes();
  }, []);  

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
      <button onClick={() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }}>
        Log Out
      </button>
    </div>
  );  
}  

export default App;
