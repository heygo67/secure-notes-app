import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { encryptNote } from "./utils/crypto";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { fetchWithAuth } from "./utils/fetchWithAuth";

function NotesPage({ notes, setNotes, onLogout, searchTerm, setSearchTerm }) {
  const addNote = async ({ title, text }) => {
    if (!title.trim() || !text.trim()) return;
    const encryptedTitle = encryptNote(title);
    const encrypted = encryptNote(text);

    const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: encryptedTitle, encrypted }),
    });

    if (res.ok) {
      const newNote = await res.json();
      setNotes(prev => [...prev, newNote]);
    }
  };

  const deleteNote = async (noteId) => {
    await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/notes/${noteId}`, {
      method: "DELETE"
    });

    setNotes(prev => prev.filter(note => note._id !== noteId));
  };

  return (
    <>
      <NoteForm onAdd={addNote} />
      <input
        type="text"
        placeholder="Search titles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <NoteList notes={notes} onDelete={deleteNote} searchTerm={searchTerm} />
      <button onClick={onLogout} className="logout-button">Log Out</button>
    </>
  );
}

function App() {
  const [notes, setNotes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/notes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setNotes(Array.isArray(data) ? data : []);
        } else if (res.status === 401) {
          // token refresh must have failed
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setNotes([]);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <h1>Secure Notes</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<RegisterForm onRegisterSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/notes" element={
            isAuthenticated ? (
              <NotesPage
                notes={notes}
                setNotes={setNotes}
                onLogout={handleLogout}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
