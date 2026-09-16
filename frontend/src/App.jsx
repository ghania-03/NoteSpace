import { useEffect, useState } from "react";
import "./App.css";

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
      <div className="auth-page">
        <div className="auth-decoration decoration-one"></div>
        <div className="auth-decoration decoration-two"></div>

        <div className="auth-container">
          <div className="auth-brand">
            <div className="brand-icon">N</div>
            <span>NoteSpace</span>
          </div>

          <div className="auth-card">
            <div className="auth-header">
              <h1>
                {isRegistering
                  ? "Create your account"
                  : "Welcome back"}
              </h1>

              <p>
                {isRegistering
                  ? "Start organizing your thoughts today."
                  : "Sign in to access your personal notes."}
              </p>
            </div>

            {(error || sessionExpired) && (
              <div className="error-message">
                <span>!</span>
                {sessionExpired
                  ? "Your session has expired. Please log in again."
                  : error}
              </div>
            )}

            <form onSubmit={handleAuth} className="auth-form">
              {isRegistering && (
                <div className="form-group">
                  <label>Name</label>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-button"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isRegistering
                  ? "Create account"
                  : "Sign in"}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button
                onClick={() => {
                  setIsRegistering((current) => !current);
                  setError("");
                  setSessionExpired(false);
                }}
              >
                {isRegistering ? "Sign in" : "Create one"}
              </button>
            </div>
          </div>

          <p className="auth-footer">
            Your thoughts. Your space. Your notes.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------
  // DASHBOARD
  // -------------------------

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">N</div>
          <span>NoteSpace</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">▤</span>
            <span>My Notes</span>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>My Notes</h1>
          </div>

          <div className="topbar-user">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            <span>!</span>
            {error}

            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {/* Create note */}
        <section className="create-section">
          <div className="section-heading">
            <div>
              <h2>Create a new note</h2>
              <p>Capture an idea, task, or thought.</p>
            </div>
          </div>

          <form className="note-form" onSubmit={createNote}>
            <input
              className="note-title-input"
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="note-content-input"
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
            />

            <div className="form-footer">
              <span className="hint">
                Keep your ideas organized.
              </span>

              <button
                type="submit"
                className="primary-button"
              >
                + Add Note
              </button>
            </div>
          </form>
        </section>

        {/* Notes */}
        <section className="notes-section">
          <div className="notes-header">
            <div>
              <h2>Your notes</h2>

              <span className="note-count">
                {notes.length}{" "}
                {notes.length === 1 ? "note" : "notes"}
              </span>
            </div>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {notesLoading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p>Loading your notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✎</div>

              <h3>
                {search
                  ? "No matching notes"
                  : "No notes yet"}
              </h3>

              <p>
                {search
                  ? "Try searching for something else."
                  : "Create your first note above and start capturing your ideas."}
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <article
                  className="note-card"
                  key={note._id}
                >
                  <div className="note-card-top">
                    <span className="note-dot"></span>

                    <div className="note-card-actions">
                      {/* Edit button */}
                      <button
                        className="edit-button"
                        onClick={() =>
                          setEditingNote(note)
                        }
                        title="Edit note"
                      >
                        ✎
                      </button>

                      {/* Delete button */}
                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteNote(note._id)
                        }
                        title="Delete note"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <h3>{note.title}</h3>

                  <p>{note.content}</p>

                  <div className="note-card-footer">
                    <span>
                      {new Date(
                        note.createdAt
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <div className="edit-header">
              <div>
                <p className="eyebrow">EDIT NOTE</p>
                <h2>Edit your note</h2>
              </div>

              <button
                className="close-button"
                onClick={() => {
                  setEditingNote(null);
                  setError("");
                }}
                title="Close"
              >
                ×
              </button>
            </div>

            <EditNoteForm
              note={editingNote}
              onSave={updateNote}
              onCancel={() => {
                setEditingNote(null);
                setError("");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------
// EDIT NOTE FORM
// -------------------------

function EditNoteForm({ note, onSave, onCancel }) {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      return;
    }

    onSave(
      note._id,
      editTitle.trim(),
      editContent.trim()
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="edit-form"
    >
      <div className="form-group">
        <label>Title</label>

        <input
          type="text"
          value={editTitle}
          onChange={(e) =>
            setEditTitle(e.target.value)
          }
          placeholder="Note title..."
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Content</label>

        <textarea
          value={editContent}
          onChange={(e) =>
            setEditContent(e.target.value)
          }
          placeholder="Write your note..."
          rows="8"
        />
      </div>

      <div className="edit-form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-button"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default App;