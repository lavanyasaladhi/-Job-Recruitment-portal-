import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import logoImg from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "candidate";

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <Link
        to={isRecruiter ? "/recruiter-dashboard" : "/"}
        className="navbar-logo"
      >
        <span className="logo-icon" aria-hidden="true">
          <img src={logoImg} alt="CareerConnect Logo" className="logo-img" />
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

      {/* Navigation Links: Strict role-based rendering */}
      <nav className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
        {isRecruiter ? (
          /* Recruiter Navigation: ONLY visible to authenticated recruiters */
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
        ) : isCandidate ? (
          /* Candidate Navigation: Visible after candidate logs in */
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

            <Link
              to="/my-applications"
              className={pathname === "/my-applications" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              My Applications
            </Link>
          </>
        ) : (
          /* Public / Unauthenticated Navigation */
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
          </>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="navbar-actions">
        {isRecruiter ? (
          /* Recruiter authenticated user actions */
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-deep, #203832)",
                background: "rgba(255, 255, 255, 0.85)",
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid var(--color-border, #e5e6dc)",
              }}
            >
              <Briefcase size={14} color="var(--color-primary, #636b2f)" />
              <span>Recruiter: {user.name || user.email}</span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
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
        ) : isCandidate ? (
          /* Candidate authenticated user actions */
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
              <span>{user.name}</span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
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
          /* Unauthenticated user actions */
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
