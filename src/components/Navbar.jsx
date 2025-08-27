import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "./Logo";

function Navbar({ onSignInClick, showSignOut = false, currentUser }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav
      style={{ height: "85px" }}
      className={`navbar navbar-expand-lg py-2 ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}
    >
      <div className="container-fluid">
        {/* Left side: Logo + Title */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <Logo size="medium" showText={true} />
        </a>

        {/* Right side: Dark Mode Toggle + Sign In/Out button */}
        <div className="d-flex align-items-center">
          <div className="form-check form-switch me-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="darkModeToggle"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <label className="form-check-label" htmlFor="darkModeToggle">
              {darkMode ? "🌙" : "☀️"}
            </label>
          </div>

          {showSignOut && currentUser ? (
            <div className="d-flex align-items-center">
              <span className="me-3 text-muted">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                className={`btn btn-outline-${darkMode ? "light" : "danger"}`}
                onClick={onSignInClick}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className={`btn btn-outline-${darkMode ? "light" : "dark"}`}
              onClick={onSignInClick}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
