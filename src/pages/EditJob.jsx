import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobById, updateJob } from "../services/api";
import "./PortalPages.css";

function EditJob() {
  const { jobId } = useParams();
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
  const [postedDate, setPostedDate] = useState("");

  // Loading and error state
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load existing job data on mount
  useEffect(() => {
    const controller = new AbortController();

    async function fetchJob() {
      setFetchLoading(true);
      setError("");

      try {
        const job = await getJobById(jobId, { signal: controller.signal });
        setTitle(job.title || "");
        setCompany(job.company || "");
        setLocation(job.location || "");
        setType(job.type || "Full-time");
        setExperience(job.experience || 0);
        setSalary(job.salary || "");
        setSkills(
          Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || ""
        );
        setDescription(job.description || "");
        setPostedDate(job.postedDate || "");
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load job details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setFetchLoading(false);
        }
      }
    }

    fetchJob();
    return () => controller.abort();
  }, [jobId]);

  // Form submit handler
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !company.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaveLoading(true);

    try {
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
        postedDate: postedDate || new Date().toISOString().split("T")[0],
        skills: skillsArray,
        description: description.trim(),
      };

      await updateJob(jobId, jobPayload);
      setSuccess(true);

      setTimeout(() => {
        navigate("/manage-jobs");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update job.");
    } finally {
      setSaveLoading(false);
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
          <span className="portal-eyebrow-tag">Recruiter Action</span>
          <h1 className="portal-title">
            Edit <span>Job Posting</span>
          </h1>
          <p className="portal-subtitle">
            Update job details, adjust required experience, or update salary information.
          </p>
        </div>

        {fetchLoading ? (
          <div className="portal-empty-state">
            <p>Loading job details…</p>
          </div>
        ) : (
          <section className="portal-form-card">
            {success && (
              <div className="portal-alert success">
                ✓ Job updated successfully! Redirecting to Manage Jobs…
              </div>
            )}

            {error && <div className="portal-alert error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="portal-form-grid">
                {/* Job Title */}
                <div className="portal-form-group">
                  <label htmlFor="edit-title">Job Title *</label>
                  <input
                    id="edit-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Company Name */}
                <div className="portal-form-group">
                  <label htmlFor="edit-company">Company Name *</label>
                  <input
                    id="edit-company"
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                {/* Work Location */}
                <div className="portal-form-group">
                  <label htmlFor="edit-location">Location *</label>
                  <input
                    id="edit-location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Employment Type */}
                <div className="portal-form-group">
                  <label htmlFor="edit-type">Employment Type</label>
                  <select
                    id="edit-type"
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
                  <label htmlFor="edit-exp">Required Experience (in years) *</label>
                  <input
                    id="edit-exp"
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
                  <label htmlFor="edit-salary">Salary / Package</label>
                  <input
                    id="edit-salary"
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>

                {/* Key Skills */}
                <div className="portal-form-group full-width">
                  <label htmlFor="edit-skills">Required Skills (comma separated) *</label>
                  <input
                    id="edit-skills"
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                {/* Job Description */}
                <div className="portal-form-group full-width">
                  <label htmlFor="edit-desc">Job Description *</label>
                  <textarea
                    id="edit-desc"
                    rows="5"
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
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving Changes…" : "Update Job Posting"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default EditJob;
