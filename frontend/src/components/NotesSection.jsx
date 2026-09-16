import NoteCard from "./NoteCard";

function NotesSection({
  notes,
  filteredNotes,
  search,
  setSearch,
  notesLoading,
  onEdit,
  onDelete,
}) {
  return (
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
            <NoteCard
              key={note._id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default NotesSection;