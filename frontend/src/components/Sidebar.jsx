function Sidebar({ user, onLogout }) {
  return (
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

        <button className="logout-button" onClick={onLogout}>
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;