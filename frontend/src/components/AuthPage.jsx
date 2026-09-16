function AuthPage({
  isRegistering,
  setIsRegistering,
  error,
  setError,
  sessionExpired,
  setSessionExpired,
  handleAuth,
  loading,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
}) {
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

export default AuthPage;