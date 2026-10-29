import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X, ArrowLeftRight, LogOut } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout, switchRole } = useAuth();

  const isRecruiter = user?.role === "recruiter";

  // Toggle role between candidate and recruiter
  function handleToggleRole() {
    const nextRole = isRecruiter ? "candidate" : "recruiter";
    switchRole(nextRole);
    setMenuOpen(false);
  }

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

        {/* Candidate-specific navigation links */}
        {!isRecruiter && (
          <>
            <Link
              to="/my-applications"
              className={pathname === "/my-applications" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              My Applications
            </Link>
            <Link
              to="/candidate-register"
              className={pathname === "/candidate-register" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Register Candidate
            </Link>
          </>
        )}

        {/* Recruiter-specific navigation links */}
        {isRecruiter && (
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
              to="/applications"
              className={pathname === "/applications" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Applications
            </Link>
          </>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="navbar-actions">
        {/* Role Switcher Pill - Helps with testing both roles */}
        <button
          type="button"
          onClick={handleToggleRole}
          className="role-toggle-pill"
          title={`Click to switch to ${isRecruiter ? "Candidate" : "Recruiter"} role`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "1px solid var(--color-border)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            fontSize: "12px",
            fontWeight: 600,
            color: isRecruiter ? "#1e3a8a" : "#166534",
            cursor: "pointer",
          }}
        >
          <ArrowLeftRight size={14} />
          <span>Role: {isRecruiter ? "Recruiter" : "Candidate"}</span>
        </button>

        {/* User state buttons */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-deep)",
                display: "none",
              }}
              className="navbar-username"
            >
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
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="login-link"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
        )}

        {/* Primary CTA button */}
        {isRecruiter ? (
          <Link
            to="/add-job"
            className="register-button"
            onClick={() => setMenuOpen(false)}
          >
            + Post Job
          </Link>
        ) : (
          <Link
            to="/jobs"
            className="register-button"
            onClick={() => setMenuOpen(false)}
          >
            Explore Jobs
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
