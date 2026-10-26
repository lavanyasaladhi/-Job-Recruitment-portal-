
import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Demo only: connect the backend authentication API here.
    alert("Login form submitted!");
  };

  return (
    <div className="portal-login-page">
      {/* Background glow without corner lines */}
      <div className="portal-glow portal-glow-left" />
      <div className="portal-glow portal-glow-right" />

      <main className="portal-login-main">
        <h1 className="portal-hero-title">
          Find your dream job here
        </h1>

        <section className="portal-login-card">
          <header className="portal-login-heading">
            <p className="portal-eyebrow">
              JOB RECRUITMENT PORTAL
            </p>

            <h2>
              Welcome <span>Back</span>
            </h2>

            <p className="portal-subtitle">
              Sign in to your Job Recruitment Portal
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {/* Email */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Password"
                  aria-label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="portal-password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="portal-signin-button"
            >
              <span>Sign In</span>
              <span className="portal-arrow">→</span>
            </button>
          </form>

          {/* Divider */}
          <div className="portal-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          {/* Register */}
          <p className="portal-register-text">
            Don’t have an account?
            <a href="/register">Register</a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;
