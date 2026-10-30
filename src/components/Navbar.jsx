import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const isRecruiterView =
    pathname.startsWith("/recruiter") ||
    pathname.startsWith("/manage-jobs") ||
    pathname.startsWith("/add-job") ||
    pathname.startsWith("/edit-job") ||
    pathname.startsWith("/applications");

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
        {isRecruiterView ? (
          <>
            <Link
              to="/recruiter-dashboard"
              className={pathname === "/recruiter-dashboard" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              to="/manage-jobs"
              className={pathname === "/manage-jobs" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Manage Jobs
            </Link>

            <Link
              to="/add-job"
              className={pathname === "/add-job" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Post Job
            </Link>

            <Link
              to="/applications"
              className={pathname.startsWith("/applications") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Applications
            </Link>
          </>
        ) : (
          <>
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
          </>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="navbar-actions">
        {isRecruiterView ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-deep, #203832)",
                background: "rgba(99, 107, 47, 0.12)",
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(99, 107, 47, 0.25)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Recruiter Mode
            </span>

            <Link
              to="/jobs"
              className="register-button"
              style={{ padding: "8px 16px", fontSize: "13px" }}
              onClick={() => setMenuOpen(false)}
            >
              Candidate Portal
            </Link>
          </div>
        ) : user ? (
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
