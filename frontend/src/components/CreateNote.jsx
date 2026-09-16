function CreateNote({
  title,
  setTitle,
  content,
  setContent,
  onSubmit,
}) {
  return (
    <section className="create-section">
      <div className="section-heading">
        <div>
          <h2>Create a new note</h2>
          <p>Capture an idea, task, or thought.</p>
        </div>
      </div>

      <form className="note-form" onSubmit={onSubmit}>
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
  );
}

export default CreateNote;