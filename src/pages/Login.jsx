import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { getCandidates, createCandidate } from "../services/api";
import "./Login.css";

function Login({ initialMode = "signin" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Role: candidate or recruiter (derived with override support)
  const queryRole = searchParams.get("role");
  const [roleOverride, setRoleOverride] = useState(null);
  const role =
    roleOverride ??
    (queryRole === "recruiter" ? "recruiter" : "candidate");

  // Mode: signin or register (derived with override support)
  const queryMode = searchParams.get("mode");
  const [modeOverride, setModeOverride] = useState(null);
  const mode =
    modeOverride ??
    (queryMode === "register" || initialMode === "register"
      ? "register"
      : "signin");

  const redirectUrl = searchParams.get("redirect") || "";

  // Controlled form inputs
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRoleChange(newRole) {
    setRoleOverride(newRole);
    setNotice(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("role", newRole);
      return next;
    });
  }

  function handleModeChange(newMode) {
    setModeOverride(newMode);
    setNotice(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("mode", newMode);
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    // ==========================================
    // RECRUITER LOGIN FLOW
    // ==========================================
    if (role === "recruiter") {
      if (!email.trim()) {
        setNotice({
          type: "error",
          text: "Please enter your recruiter work email.",
        });
        setIsSubmitting(false);
        return;
      }

      if (mode === "register" && !name.trim()) {
        setNotice({
          type: "error",
          text: "Please provide your full recruiter name.",
        });
        setIsSubmitting(false);
        return;
      }

      const recruiterUser = {
        id: "recruiter-" + (email.split("@")[0] || Date.now()),
        name:
          name.trim() ||
          email
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email.trim(),
        company: company.trim() || "CareerConnect Partner",
        role: "recruiter",
      };

      login(recruiterUser);

      setNotice({
        type: "success",
        text: `Welcome, ${recruiterUser.name}! Signed in as Recruiter. Opening workspace…`,
      });

      setTimeout(() => {
        const destination =
          redirectUrl && redirectUrl.startsWith("/")
            ? redirectUrl
            : "/recruiter-dashboard";
        navigate(destination);
      }, 900);
      return;
    }

    // ==========================================
    // CANDIDATE LOGIN FLOW
    // ==========================================
    if (mode === "register") {
      if (!name.trim()) {
        setNotice({
          type: "error",
          text: "Please provide your full name.",
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const candidatePayload = {
          name: name.trim(),
          email: email.trim(),
          role: "candidate",
          registeredAt: new Date().toISOString(),
        };

        const saved = await createCandidate(candidatePayload);
        login({
          ...saved,
          role: "candidate",
        });
      } catch {
        login({
          id: Date.now(),
          name: name.trim(),
          email: email.trim(),
          role: "candidate",
        });
      }

      setNotice({
        type: "success",
        text: `Registration successful for ${name}! Entering candidate portal…`,
      });

      setTimeout(() => {
        const destination =
          redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/jobs";
        navigate(destination);
      }, 900);
    } else {
      // Candidate Sign In
      if (!email.trim()) {
        setNotice({
          type: "error",
          text: "Please enter your email.",
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const candidates = await getCandidates();
        const matched = candidates.find(
          (candidate) =>
            candidate.email?.toLowerCase() === email.trim().toLowerCase()
        );

        if (matched) {
          login({
            ...matched,
            role: "candidate",
          });
        } else {
          login({
            id: Date.now(),
            name: email.split("@")[0],
            email: email.trim(),
            role: "candidate",
          });
        }
      } catch {
        login({
          id: Date.now(),
          name: email.split("@")[0],
          email: email.trim(),
          role: "candidate",
        });
      }

      setNotice({
        type: "success",
        text: `Welcome back! Signed in as Candidate (${email}).`,
      });

      setTimeout(() => {
        const destination =
          redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/jobs";
        navigate(destination);
      }, 900);
    }
  }

  const isRegister = mode === "register";
  const isRecruiter = role === "recruiter";

  return (
    <main className="portal-login-page">
      <div className="portal-glow portal-glow-left" aria-hidden="true" />
      <div className="portal-glow portal-glow-right" aria-hidden="true" />

      <div className="portal-login-main">
        <h1 className="portal-hero-title">
          {isRecruiter
            ? "Recruiter & Talent Portal"
            : isRegister
            ? "Start your career journey"
            : "Find your dream job here"}
        </h1>

        <section className="portal-login-card">
          {/* Account Role Selector */}
          <div className="portal-role-group">
            <span className="portal-role-label">Choose Account Type:</span>
            <div
              className="portal-role-options"
              role="radiogroup"
              aria-label="Account Role"
            >
              <button
                type="button"
                role="radio"
                aria-checked={!isRecruiter}
                className={`portal-role-option ${!isRecruiter ? "selected" : ""}`}
                onClick={() => handleRoleChange("candidate")}
              >
                <User size={16} />
                <span>Candidate</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={isRecruiter}
                className={`portal-role-option ${isRecruiter ? "selected" : ""}`}
                onClick={() => handleRoleChange("recruiter")}
              >
                <BriefcaseBusiness size={16} />
                <span>Recruiter</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs (Sign In / Register) */}
          <div className="portal-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegister}
              className={`portal-tab ${!isRegister ? "active" : ""}`}
              onClick={() => handleModeChange("signin")}
            >
              Sign In
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              className={`portal-tab ${isRegister ? "active" : ""}`}
              onClick={() => handleModeChange("register")}
            >
              Register
            </button>
          </div>

          <header className="portal-login-heading">
            <p className="portal-eyebrow">
              {isRecruiter
                ? isRegister
                  ? "CREATE RECRUITER ACCOUNT"
                  : "RECRUITER WORKSPACE"
                : isRegister
                ? "CREATE CANDIDATE ACCOUNT"
                : "CANDIDATE PORTAL"}
            </p>

            <h2>
              {isRecruiter ? (
                isRegister ? (
                  <>
                    Join as <span>Recruiter</span>
                  </>
                ) : (
                  <>
                    Recruiter <span>Sign In</span>
                  </>
                )
              ) : isRegister ? (
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
              {isRecruiter
                ? isRegister
                  ? "Register your organization to post jobs and review applicants"
                  : "Sign in to manage your active jobs and applicant pipeline"
                : isRegister
                ? "Create your profile to search and apply for jobs"
                : "Sign in to track your job applications"}
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {/* Full Name field (Register mode) */}
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
                    placeholder={
                      isRecruiter ? "Hiring Manager / Recruiter Name" : "Full Name"
                    }
                    aria-label="Full Name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Company Name field (Recruiter Register mode) */}
            {isRecruiter && isRegister && (
              <div className="portal-field">
                <div className="portal-input-wrapper">
                  <Building2
                    className="portal-input-icon"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name (e.g. L&T Technology Services)"
                    aria-label="Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
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
                  placeholder={
                    isRecruiter ? "Recruiter Work Email" : "Email Address"
                  }
                  aria-label="Email Address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="portal-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
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

            <button
              type="submit"
              className="portal-signin-button"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting
                  ? "Authenticating…"
                  : isRegister
                  ? isRecruiter
                    ? "Create Recruiter Account"
                    : "Create Candidate Account"
                  : isRecruiter
                  ? "Sign In as Recruiter"
                  : "Sign In as Candidate"}
              </span>
              <span className="portal-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          {notice && (
            <p
              className={`portal-login-notice ${
                notice.type === "success"
                  ? "success"
                  : notice.type === "info"
                  ? "info"
                  : ""
              }`}
              role="alert"
            >
              {notice.text}
            </p>
          )}

          {/* Quick toggle between candidate and recruiter */}
          <div className="portal-footer-links">
            <p className="portal-register-text">
              {isRecruiter ? (
                <>
                  Looking for job vacancies?{" "}
                  <button
                    type="button"
                    className="portal-inline-link"
                    onClick={() => handleRoleChange("candidate")}
                  >
                    Switch to Candidate Sign In
                  </button>
                </>
              ) : (
                <>
                  Hiring for your team?{" "}
                  <button
                    type="button"
                    className="portal-inline-link"
                    onClick={() => handleRoleChange("recruiter")}
                  >
                    Switch to Recruiter Sign In
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
