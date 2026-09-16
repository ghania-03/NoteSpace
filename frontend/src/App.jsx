import { useEffect, useState } from "react";
import "./App.css";

import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CreateNote from "./components/CreateNote";
import NotesSection from "./components/NotesSection";
import EditNoteModal from "./components/EditNoteModal";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [notes, setNotes] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch] = useState("");

  // Stores the note currently being edited
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  // -------------------------
  // AUTH / SESSION HANDLING
  // -------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setNotes([]);
    setEditingNote(null);
  };

  const handleSessionExpired = () => {
    logout();
    setSessionExpired(true);
  };

  // Centralized protected API request handler
  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      handleSessionExpired();
      return null;
    }

    return response;
  };

  // -------------------------
  // FETCH NOTES
  // -------------------------

  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      setError("");

      const response = await fetchWithAuth(`${API_URL}/notes`);

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNotes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setNotesLoading(false);
    }
  };

  // -------------------------
  // LOGIN / REGISTER
  // -------------------------

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSessionExpired(false);

      const endpoint = isRegistering
        ? "/auth/register"
        : "/auth/login";

      const body = isRegistering
        ? { name, email, password }
        : { email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CREATE NOTE
  // -------------------------

  const createNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and content.");
      return;
    }

    try {
      setError("");

      const response = await fetchWithAuth(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNotes((currentNotes) => [data, ...currentNotes]);

      setTitle("");
      setContent("");
    } catch (error) {
      setError(error.message);
    }
  };

  // -------------------------
  // UPDATE NOTE
  // -------------------------

  const updateNote = async (id, updatedTitle, updatedContent) => {
    if (!updatedTitle.trim() || !updatedContent.trim()) {
      setError("Please enter both a title and content.");
      return;
    }

    try {
      setError("");

      const response = await fetchWithAuth(
        `${API_URL}/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
          }),
        }
      );

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update note"
        );
      }

      // Replace the old note with the updated note
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note._id === id ? data : note
        )
      );

      // Close edit modal
      setEditingNote(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // -------------------------
  // DELETE NOTE
  // -------------------------

  const deleteNote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetchWithAuth(
        `${API_URL}/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // -------------------------
  // SEARCH
  // -------------------------

  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    );
  });

  // -------------------------
  // AUTH PAGE
  // -------------------------

  if (!token) {
    return (
      <AuthPage
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        error={error}
        setError={setError}
        sessionExpired={sessionExpired}
        setSessionExpired={setSessionExpired}
        handleAuth={handleAuth}
        loading={loading}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    );
  }

  // -------------------------
  // DASHBOARD
  // -------------------------

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        onLogout={logout}
      />

      <main className="main-content">
        <Topbar user={user} />

        {error && (
          <div className="dashboard-error">
            <span>!</span>
            {error}

            <button onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        <CreateNote
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onSubmit={createNote}
        />

        <NotesSection
          notes={notes}
          filteredNotes={filteredNotes}
          search={search}
          setSearch={setSearch}
          notesLoading={notesLoading}
          onEdit={setEditingNote}
          onDelete={deleteNote}
        />
      </main>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onSave={updateNote}
          onCancel={() => {
            setEditingNote(null);
            setError("");
          }}
          onClose={() => {
            setEditingNote(null);
            setError("");
          }}
        />
      )}
    </div>
  );
}

export default App;