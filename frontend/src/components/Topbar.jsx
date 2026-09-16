function Topbar({ user }) {
  return (
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
  );
}

export default Topbar;