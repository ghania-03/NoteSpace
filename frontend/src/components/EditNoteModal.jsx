import { useState } from "react";

function EditNoteModal({
  note,
  onSave,
  onCancel,
  onClose,
}) {
  return (
    <div className="edit-overlay">
      <div className="edit-modal">
        <div className="edit-header">
          <div>
            <p className="eyebrow">EDIT NOTE</p>
            <h2>Edit your note</h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>

        <EditNoteForm
          note={note}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

function EditNoteForm({
  note,
  onSave,
  onCancel,
}) {
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

export default EditNoteModal;