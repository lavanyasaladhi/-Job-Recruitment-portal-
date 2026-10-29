import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import "./Login.css";

function Login({ initialMode = "signin" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryMode = searchParams.get("mode");

  const [modeOverride, setModeOverride] = useState(null);
  const mode =
    modeOverride ??
    (queryMode === "register" || initialMode === "register"
      ? "register"
      : "signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);

  function switchMode(newMode) {
    setModeOverride(newMode);
    setNotice(null);
    setSearchParams({ mode: newMode });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "register") {
      if (!name.trim()) {
        setNotice({ type: "error", text: "Please provide your full name." });
        return;
      }

      // Save user profile locally
      const registeredUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role: "candidate",
        registeredAt: new Date().toISOString(),
      };

      // Set user session in context
      login(registeredUser);

      setNotice({
        type: "success",
        text: `Registration successful for ${name}! Entering your portal…`,
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 1200);
    } else {
      // Sign-in handler
      if (!email.trim()) {
        setNotice({ type: "error", text: "Please enter your email." });
        return;
      }

      const signedInUser = {
        id: Date.now(),
        name: email.split("@")[0],
        email: email.trim(),
        role: "candidate",
      };

      login(signedInUser);

      setNotice({
        type: "success",
        text: `Welcome back! Signed in as ${email}.`,
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 1000);
    }
  }

  const isRegister = mode === "register";

  return (
    <main className="portal-login-page">
      <div className="portal-glow portal-glow-left" aria-hidden="true" />
      <div className="portal-glow portal-glow-right" aria-hidden="true" />

      <div className="portal-login-main">
        <h1 className="portal-hero-title">
          {isRegister ? "Start your career journey" : "Find your dream job here"}
        </h1>

        <section className="portal-login-card">
          {/* Mode Switcher Tabs */}
          <div className="portal-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegister}
              className={`portal-tab ${!isRegister ? "active" : ""}`}
              onClick={() => switchMode("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              className={`portal-tab ${isRegister ? "active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          <header className="portal-login-heading">
            <p className="portal-eyebrow">
              {isRegister ? "CREATE CANDIDATE ACCOUNT" : "CANDIDATE PORTAL"}
            </p>
            <h2>
              {isRegister ? (
                <>
                  Register as <span>Candidate</span>
                </>
              ) : (
                <>
                  Welcome <span>Back</span>
                </>
              )}
            </h2>
            <p className="portal-subtitle">
              {isRegister
                ? "Create your profile to search and apply for jobs"
                : "Sign in to track your job applications"}
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {/* Full Name field (Only in Register mode) */}
            {isRegister && (
              <div className="portal-field">
                <div className="portal-input-wrapper">
                  <User
                    className="portal-input-icon"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="portal-field">
              <div className="portal-input-wrapper">
                <Mail
                  className="portal-input-icon"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="portal-field">
              <div className="portal-input-wrapper">
                <LockKeyhole
                  className="portal-input-icon"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={isRegister ? "Create Password" : "Password"}
                  aria-label="Password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="portal-password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={19} aria-hidden="true" />
                  ) : (
                    <Eye size={19} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="portal-signin-button">
              <span>{isRegister ? "Create Account" : "Sign In"}</span>
              <span className="portal-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          {notice && (
            <p
              className={`portal-login-notice ${
                notice.type === "success" ? "success" : ""
              }`}
              role="alert"
            >
              {notice.text}
            </p>
          )}

          {/* New User Option Link */}
          <div className="portal-footer-links">
            <p className="portal-register-text">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="portal-inline-link"
                    onClick={() => switchMode("signin")}
                  >
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  New user?{" "}
                  <button
                    type="button"
                    className="portal-inline-link"
                    onClick={() => switchMode("register")}
                  >
                    Register for new users
                  </button>
                </>
              )}
            </p>

            <Link className="portal-home-link" to="/">
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
