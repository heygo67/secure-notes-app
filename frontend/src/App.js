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
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  // Apply theme class to <body> when theme changes
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const addNote = async ({ title, text }) => {
    if (!title.trim() || !text.trim()) return;

    const token = localStorage.getItem("token");
    const encryptedTitle = encryptNote(title);
    const encrypted = encryptNote(text);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: encryptedTitle, encrypted }),
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
        Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched notes:", data);

        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          console.error("Expected notes array but got:", data);
          setNotes([]);
        }
      }

    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setNotes([]);
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      <h1>Secure Notes</h1>

      <button onClick={toggleTheme} className="theme-toggle">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      {!isAuthenticated ? (
        <>
          <p>Please log in or register to access your notes.</p>
          <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
          <RegisterForm onRegisterSuccess={() => setIsAuthenticated(true)} />
        </>
      ) : (
        <>
          <NoteForm onAdd={addNote} />
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>
          <NoteList notes={notes} onDelete={deleteNote} searchTerm={searchTerm} />
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </>
      )}
    </div>
  );
}

export default App;
