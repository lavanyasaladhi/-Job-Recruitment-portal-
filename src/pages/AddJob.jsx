import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createJob } from "../services/api";
import "./PortalPages.css";

function AddJob() {
  const navigate = useNavigate();

  // Controlled form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [experience, setExperience] = useState(0);
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form submit handler
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // Simple validation
    if (!title.trim()) {
      setError("Please enter a job title.");
      return;
    }
    if (!company.trim()) {
      setError("Please enter the hiring company name.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter the job location or Remote.");
      return;
    }

    setLoading(true);

    try {
      // Split comma separated skills
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const jobPayload = {
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        type,
        experience: Number(experience) || 0,
        salary: salary.trim(),
        postedDate: new Date().toISOString().split("T")[0],
        skills: skillsArray,
        description: description.trim(),
      };

      await createJob(jobPayload);
      setSuccess(true);

      // Redirect to manage jobs after brief notification
      setTimeout(() => {
        navigate("/manage-jobs");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <main className="portal-container">
        <Link to="/manage-jobs" className="portal-back-btn">
          ← Back to Manage Jobs
        </Link>

        <div className="portal-header">
          <span className="portal-eyebrow-tag">Recruiter Form</span>
          <h1 className="portal-title">
            Post a New <span>Job Vacancy</span>
          </h1>
          <p className="portal-subtitle">
            Fill in the details below to publish a new job opening for prospective candidates.
          </p>
        </div>

        <section className="portal-form-card">
          {success && (
            <div className="portal-alert success">
              ✓ Job created successfully! Redirecting to Manage Jobs…
            </div>
          )}

          {error && <div className="portal-alert error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="portal-form-grid">
              {/* Job Title */}
              <div className="portal-form-group">
                <label htmlFor="job-title">Job Title *</label>
                <input
                  id="job-title"
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Company Name */}
              <div className="portal-form-group">
                <label htmlFor="job-company">Company Name *</label>
                <input
                  id="job-company"
                  type="text"
                  placeholder="e.g. L&T Technology Services"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {/* Work Location */}
              <div className="portal-form-group">
                <label htmlFor="job-location">Location *</label>
                <input
                  id="job-location"
                  type="text"
                  placeholder="e.g. Hyderabad, Bengaluru, Remote"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Employment Type */}
              <div className="portal-form-group">
                <label htmlFor="job-type">Employment Type</label>
                <select
                  id="job-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Required Experience */}
              <div className="portal-form-group">
                <label htmlFor="job-exp">Required Experience (in years) *</label>
                <input
                  id="job-exp"
                  type="number"
                  min="0"
                  max="30"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              {/* Salary / Compensation */}
              <div className="portal-form-group">
                <label htmlFor="job-salary">Salary / Package (Optional)</label>
                <input
                  id="job-salary"
                  type="text"
                  placeholder="e.g. 12 - 18 LPA"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              {/* Key Skills */}
              <div className="portal-form-group full-width">
                <label htmlFor="job-skills">Required Skills (comma separated) *</label>
                <input
                  id="job-skills"
                  type="text"
                  placeholder="e.g. React, JavaScript, Redux, REST API"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <span className="form-hint">
                  List key technical and domain skills required for this position.
                </span>
              </div>

              {/* Job Description */}
              <div className="portal-form-group full-width">
                <label htmlFor="job-desc">Job Description *</label>
                <textarea
                  id="job-desc"
                  rows="5"
                  placeholder="Describe the role, responsibilities, requirements, and benefits…"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="portal-form-actions">
              <Link to="/manage-jobs" className="portal-secondary-btn">
                Cancel
              </Link>
              <button
                type="submit"
                className="portal-primary-btn"
                disabled={loading}
              >
                {loading ? "Publishing Job…" : "Publish Job Posting"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AddJob;
