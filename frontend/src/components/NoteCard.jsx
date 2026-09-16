function NoteCard({
  note,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className="note-card"
      key={note._id}
    >
      <div className="note-card-top">
        <span className="note-dot"></span>

        <div className="note-card-actions">
          <button
            className="edit-button"
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            ✎
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(note._id)}
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
  );
}

export default NoteCard;