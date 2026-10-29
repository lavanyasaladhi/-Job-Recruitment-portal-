import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Edit2, Trash2, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobs, deleteJob } from "../services/api";
import "./PortalPages.css";

function ManageJobs() {
  const [jobList, setJobList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  // Load all jobs from API
  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        const data = await getJobs({ signal: controller.signal });
        setJobList(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load jobs.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJobs();
    return () => controller.abort();
  }, []);

  // Handle job deletion
  async function handleDeleteJob(id, title) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the job posting "${title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteJob(id);
      // Remove deleted job from local list
      setJobList((previousJobs) =>
        previousJobs.filter((job) => String(job.id) !== String(id))
      );
      setNotice({
        type: "success",
        text: `Job "${title}" was successfully deleted.`,
      });
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Failed to delete the job.",
      });
    }
  }

  // Filter jobs based on search term
  const filteredJobs = jobList.filter((job) => {
    const search = searchTerm.toLowerCase();
    const titleMatch = job.title?.toLowerCase().includes(search);
    const companyMatch = job.company?.toLowerCase().includes(search);
    const locationMatch = job.location?.toLowerCase().includes(search);
    return titleMatch || companyMatch || locationMatch;
  });

  return (
    <div>
      <Navbar />

      <main className="portal-container">
        <div className="portal-header-row">
          <div>
            <span className="portal-eyebrow-tag">Recruiter Portal</span>
            <h1 className="portal-title">
              Manage <span>Job Vacancies</span>
            </h1>
            <p className="portal-subtitle">
              Add new career opportunities, update active postings, or delete filled positions.
            </p>
          </div>

          <Link to="/add-job" className="portal-primary-btn">
            <PlusCircle size={18} />
            Post New Job
          </Link>
        </div>

        {notice && (
          <div className={`portal-alert ${notice.type}`}>{notice.text}</div>
        )}

        {/* Search Bar */}
        <div className="portal-filter-bar">
          <div className="portal-filter-group" style={{ flex: 1 }}>
            <Search size={18} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search by job title, company, or location…"
              style={{ width: "min(400px, 100%)" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Showing {filteredJobs.length} of {jobList.length} postings
          </span>
        </div>

        {loading ? (
          <div className="portal-empty-state">
            <p>Loading job postings…</p>
          </div>
        ) : error ? (
          <div className="portal-empty-state">
            <h3>Error loading jobs</h3>
            <p>{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="portal-empty-state">
            <h3>No jobs found</h3>
            <p>
              {searchTerm
                ? "No jobs match your search filter. Try clearing the search term."
                : "No jobs have been posted yet. Create your first job posting now!"}
            </p>
            {!searchTerm && (
              <Link to="/add-job" className="portal-primary-btn">
                Post a Job Now
              </Link>
            )}
          </div>
        ) : (
          <div className="portal-table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location & Type</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                      {job.postedDate && (
                        <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                          Posted: {job.postedDate}
                        </div>
                      )}
                    </td>
                    <td>{job.company || "Company"}</td>
                    <td>
                      <div>{job.location || "Location unlisted"}</div>
                      <span style={{ fontSize: "12px", color: "var(--color-primary)", fontWeight: 600 }}>
                        {job.type}
                      </span>
                    </td>
                    <td>{job.experience ? `${job.experience} yrs` : "Fresher"}</td>
                    <td>{job.salary || "Not specified"}</td>
                    <td>
                      <div className="portal-actions-cell">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="portal-secondary-btn"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                          title="View public job details"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                        <Link
                          to={`/edit-job/${job.id}`}
                          className="portal-secondary-btn"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                          title="Edit this job"
                        >
                          <Edit2 size={14} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="portal-danger-btn"
                          style={{ padding: "6px 10px" }}
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          title="Delete this job"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ManageJobs;
