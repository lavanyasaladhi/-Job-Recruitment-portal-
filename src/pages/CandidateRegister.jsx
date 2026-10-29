import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createCandidate } from "../services/api";
import { useAuth } from "../context/useAuth";
import "./PortalPages.css";

function CandidateRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Controlled form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState(0);
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [resume, setResume] = useState("");

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form submission handler
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // Validate required fields
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // Format skills into array
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const newCandidate = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: Number(experience) || 0,
        skills: skillsArray,
        location: location.trim(),
        resume: resume.trim() || "resume.pdf",
        role: "candidate",
      };

      // Call API to create candidate record
      const savedCandidate = await createCandidate(newCandidate);

      // Sign in as the registered candidate
      login({
        ...savedCandidate,
        role: "candidate",
      });

      setSuccess(true);

      // Navigate to jobs page after short delay
      setTimeout(() => {
        navigate("/jobs");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to register profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <main className="portal-container">
        <Link to="/" className="portal-back-btn">
          ← Back to home
        </Link>

        <div className="portal-header">
          <span className="portal-eyebrow-tag">Candidate Profile</span>
          <h1 className="portal-title">
            Register as a <span>Candidate</span>
          </h1>
          <p className="portal-subtitle">
            Create your candidate profile to search job vacancies, apply with one click,
            and monitor your application status.
          </p>
        </div>

        <section className="portal-form-card">
          {success && (
            <div className="portal-alert success">
              ✓ Registration successful! Redirecting you to open job positions…
            </div>
          )}

          {error && <div className="portal-alert error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="portal-form-grid">
              {/* Full Name */}
              <div className="portal-form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Suren Sharma"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Address */}
              <div className="portal-form-group">
                <label htmlFor="reg-email">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="suren@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Contact Phone */}
              <div className="portal-form-group">
                <label htmlFor="reg-phone">Phone Number</label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Years of Experience */}
              <div className="portal-form-group">
                <label htmlFor="reg-exp">Years of Experience</label>
                <input
                  id="reg-exp"
                  type="number"
                  min="0"
                  max="40"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              {/* Current Location */}
              <div className="portal-form-group">
                <label htmlFor="reg-location">Current Location / City</label>
                <input
                  id="reg-location"
                  type="text"
                  placeholder="e.g. Hyderabad, Bengaluru, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Resume / Portfolio Link */}
              <div className="portal-form-group">
                <label htmlFor="reg-resume">Resume Document / File Name</label>
                <input
                  id="reg-resume"
                  type="text"
                  placeholder="e.g. suren_resume.pdf"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>

              {/* Skills */}
              <div className="portal-form-group full-width">
                <label htmlFor="reg-skills">Key Skills (comma separated) *</label>
                <input
                  id="reg-skills"
                  type="text"
                  placeholder="e.g. React, JavaScript, HTML, CSS, Git"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <span className="form-hint">
                  Separate each skill with a comma so recruiters can match you easily.
                </span>
              </div>
            </div>

            <div className="portal-form-actions">
              <Link to="/jobs" className="portal-secondary-btn">
                Cancel
              </Link>
              <button
                type="submit"
                className="portal-primary-btn"
                disabled={loading}
              >
                {loading ? "Creating Profile…" : "Register Candidate"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CandidateRegister;
