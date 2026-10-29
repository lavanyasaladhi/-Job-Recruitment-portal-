import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <Link to="/" className="navbar-logo">
        <span className="logo-icon" aria-hidden="true">
          <Briefcase size={20} strokeWidth={2.4} />
        </span>
        <span className="logo-text">CareerConnect</span>
      </Link>

      {/* Mobile Menu Toggle Button */}
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Links */}
      <nav className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
        <Link
          to="/"
          className={pathname === "/" ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/jobs"
          className={pathname === "/jobs" ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Find Jobs
        </Link>

        {/* Protected links - Only visible after login */}
        {user && (
          <Link
            to="/my-applications"
            className={pathname === "/my-applications" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            My Applications
          </Link>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="navbar-actions">
        {user ? (
          // Shown when candidate is logged in
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-deep)",
                background: "rgba(255, 255, 255, 0.8)",
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid var(--color-border)",
              }}
            >
              <User size={14} color="var(--color-primary)" />
              {user.name}
            </span>

            <button
              type="button"
              onClick={logout}
              className="login-link"
              style={{
                background: "none",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                padding: "6px 8px",
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          // Shown when user is not logged in
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link
              to="/login"
              className="login-link"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>

            <Link
              to="/jobs"
              className="register-button"
              onClick={() => setMenuOpen(false)}
            >
              Explore Jobs
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
