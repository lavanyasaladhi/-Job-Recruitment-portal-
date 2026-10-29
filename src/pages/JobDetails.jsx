import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobById, getApplications, createApplication } from "../services/api";
import { useAuth } from "../context/useAuth";
import "./jobs.css";
import "./PortalPages.css";

function JobDetails() {
  const { jobId } = useParams();
  const { user } = useAuth();

  // State variables for job details
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  // State variables for application process
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Application form fields (prefilled from logged in user if available)
  const [candidateName, setCandidateName] = useState(user?.name || "");
  const [candidateEmail, setCandidateEmail] = useState(user?.email || "");
  const [candidatePhone, setCandidatePhone] = useState(user?.phone || "");
  const [candidateExperience, setCandidateExperience] = useState(
    user?.experience || 0
  );
  const [candidateResume, setCandidateResume] = useState(
    user?.resume || "my_resume.pdf"
  );

  // Load job details and check if already applied
  useEffect(() => {
    const controller = new AbortController();

    async function loadJobAndApplication() {
      setLoading(true);
      setError("");

      try {
        // Fetch job details
        const jobData = await getJobById(jobId, { signal: controller.signal });
        setJob(jobData);

        // Check if user has already applied for this job
        const allApplications = await getApplications({ signal: controller.signal });
        const userEmail = user?.email || candidateEmail;
        const matched = allApplications.find(
          (app) =>
            String(app.jobId) === String(jobId) &&
            app.candidateEmail?.toLowerCase() === userEmail.toLowerCase()
        );

        if (matched) {
          setAlreadyApplied(true);
          setExistingApplication(matched);
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "Unable to load this job.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJobAndApplication();
    return () => controller.abort();
  }, [jobId, retryKey, user, candidateEmail]);

  // Handle application form submission
  async function handleApplySubmit(event) {
    event.preventDefault();
    setApplyError("");

    // Simple validation
    if (!candidateName.trim() || !candidateEmail.trim()) {
      setApplyError("Please provide both your name and email address.");
      return;
    }

    setApplyLoading(true);

    try {
      const applicationPayload = {
        jobId: job.id,
        candidateId: user?.id || Date.now(),
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString().split("T")[0],
        status: "Under Review",
      };

      const created = await createApplication(applicationPayload);
      setApplySuccess(true);
      setAlreadyApplied(true);
      setExistingApplication(created);
      setShowApplyForm(false);
    } catch (err) {
      setApplyError(err.message || "Failed to submit application. Try again.");
    } finally {
      setApplyLoading(false);
    }
  }

  return (
    <div className="jobs-page">
      <Navbar />

      <main className="jobs-main">
        <Link className="job-details-back" to="/jobs">
          ← Back to jobs
        </Link>

        {loading ? (
          <div className="jobs-status" role="status">
            <span className="jobs-spinner" aria-hidden="true" />
            <p>Loading job details…</p>
          </div>
        ) : error ? (
          <div className="jobs-status jobs-error" role="alert">
            <h1>We couldn’t load this job</h1>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((previous) => previous + 1)}
            >
              Retry
            </button>
          </div>
        ) : (
          <article className="job-details-card">
            {/* Header section */}
            <div className="job-details-header">
              <div>
                <span className="jobs-eyebrow">JOB OPPORTUNITY</span>
                <h1>{job.title}</h1>
                {job.company && <p className="job-company">{job.company}</p>}
              </div>
              {job.type && <span className="job-type">{job.type}</span>}
            </div>

            {/* Meta tags */}
            <div className="job-details-meta">
              {job.location && <span>📍 Location: {job.location}</span>}
              {job.experience !== "" && job.experience !== undefined && (
                <span>◷ Experience: {job.experience} years</span>
              )}
              {job.salary && <span>💰 Salary: {job.salary}</span>}
              {job.postedDate && <span>📅 Posted: {job.postedDate}</span>}
            </div>

            {/* Application status notification */}
            {applySuccess && (
              <div className="portal-alert success">
                ✓ Application submitted successfully! Your application is now Under Review.
              </div>
            )}

            {alreadyApplied && (
              <div
                style={{
                  padding: "16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  margin: "16px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <strong>You have already applied for this position</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#166534" }}>
                    Applied on: {existingApplication?.appliedDate || "Recently"}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    className={`status-badge ${
                      existingApplication?.status?.toLowerCase().replace(/\s+/g, "-") ||
                      "under-review"
                    }`}
                  >
                    Status: {existingApplication?.status || "Under Review"}
                  </span>
                  <Link
                    to="/my-applications"
                    className="portal-secondary-btn"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    View in My Applications
                  </Link>
                </div>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <section className="job-details-section">
                <h2>About this role</h2>
                <p>{job.description}</p>
              </section>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <section className="job-details-section">
                <h2>Required skills</h2>
                <div className="job-skills">
                  {job.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Apply Action Section */}
            <div
              style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {!alreadyApplied && !showApplyForm && (
                <button
                  type="button"
                  className="portal-primary-btn"
                  style={{ padding: "12px 28px", fontSize: "15px" }}
                  onClick={() => setShowApplyForm(true)}
                >
                  Apply for this Position →
                </button>
              )}

              {/* Application Form */}
              {showApplyForm && !alreadyApplied && (
                <div
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    padding: "24px",
                    marginTop: "16px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "16px",
                      color: "var(--color-deep)",
                      fontSize: "20px",
                    }}
                  >
                    Submit Your Application
                  </h3>

                  {applyError && (
                    <div className="portal-alert error">{applyError}</div>
                  )}

                  <form onSubmit={handleApplySubmit}>
                    <div className="portal-form-grid">
                      <div className="portal-form-group">
                        <label htmlFor="cand-name">Full Name *</label>
                        <input
                          id="cand-name"
                          type="text"
                          required
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                        />
                      </div>

                      <div className="portal-form-group">
                        <label htmlFor="cand-email">Email Address *</label>
                        <input
                          id="cand-email"
                          type="email"
                          required
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                        />
                      </div>

                      <div className="portal-form-group">
                        <label htmlFor="cand-phone">Phone Number</label>
                        <input
                          id="cand-phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={candidatePhone}
                          onChange={(e) => setCandidatePhone(e.target.value)}
                        />
                      </div>

                      <div className="portal-form-group">
                        <label htmlFor="cand-exp">Years of Experience</label>
                        <input
                          id="cand-exp"
                          type="number"
                          min="0"
                          value={candidateExperience}
                          onChange={(e) => setCandidateExperience(e.target.value)}
                        />
                      </div>

                      <div className="portal-form-group full-width">
                        <label htmlFor="cand-resume">Resume Document Name or Link</label>
                        <input
                          id="cand-resume"
                          type="text"
                          placeholder="e.g. suren_resume.pdf"
                          value={candidateResume}
                          onChange={(e) => setCandidateResume(e.target.value)}
                        />
                        <span className="form-hint">
                          Provide your resume file name or portfolio link.
                        </span>
                      </div>
                    </div>

                    <div className="portal-form-actions">
                      <button
                        type="button"
                        className="portal-secondary-btn"
                        onClick={() => setShowApplyForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="portal-primary-btn"
                        disabled={applyLoading}
                      >
                        {applyLoading ? "Submitting…" : "Confirm & Submit Application"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default JobDetails;
