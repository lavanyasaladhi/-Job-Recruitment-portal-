import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Filter, Trash2, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusDropdown from "../components/recruiter/StatusDropdown";
import { getApplications, updateApplication, deleteApplication, getJobById } from "../services/api";
import "./PortalPages.css";

function Applications() {
  const { id, jobId } = useParams();
  const filterJobId = id || jobId;

  const [applicationList, setApplicationList] = useState([]);
  const [targetJob, setTargetJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState(null);

  // Fetch applications (and target job if filtering by job ID)
  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const promises = [getApplications({ signal: controller.signal })];
        if (filterJobId) {
          promises.push(getJobById(filterJobId, { signal: controller.signal }).catch(() => null));
        }

        const [appsData, jobData] = await Promise.all(promises);
        setApplicationList(appsData);
        if (jobData) {
          setTargetJob(jobData);
        } else {
          setTargetJob(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load applications.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => controller.abort();
  }, [filterJobId]);

  // Handle changing application status (Recruiter action)
  async function handleStatusChange(application, newStatus) {
    if (application.status === newStatus) return;

    setUpdatingId(application.id);

    try {
      const updatedPayload = {
        ...application,
        status: newStatus,
      };

      const updated = await updateApplication(application.id, updatedPayload);

      // Update in local state
      setApplicationList((previousList) =>
        previousList.map((app) =>
          String(app.id) === String(application.id)
            ? { ...app, status: updated.status }
            : app
        )
      );

      setNotice({
        type: "success",
        text: `Updated ${application.candidateName}'s application status to "${newStatus}".`,
      });
      setTimeout(() => setNotice(null), 3500);
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Failed to update status.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  // Handle deleting application
  async function handleDeleteApplication(appId, candidateName) {
    const confirmed = window.confirm(
      `Delete application from ${candidateName}?`
    );
    if (!confirmed) return;

    try {
      await deleteApplication(appId);
      setApplicationList((prev) =>
        prev.filter((app) => String(app.id) !== String(appId))
      );
      setNotice({
        type: "success",
        text: `Application from ${candidateName} has been removed.`,
      });
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Failed to delete application.",
      });
    }
  }

  // Filter application list based on search, status, and job ID
  const filteredApplications = applicationList.filter((app) => {
    // Filter by specific job if active
    if (filterJobId && String(app.jobId) !== String(filterJobId)) {
      return false;
    }

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      app.status?.toLowerCase() === statusFilter.toLowerCase();

    // Search filter
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      app.candidateName?.toLowerCase().includes(search) ||
      app.candidateEmail?.toLowerCase().includes(search) ||
      app.jobTitle?.toLowerCase().includes(search) ||
      app.company?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <Navbar />

      <main className="portal-container">
        <div className="portal-header-row">
          <div>
            <span className="portal-eyebrow-tag">Recruiter Pipeline</span>
            <h1 className="portal-title">
              Candidate <span>Applications</span>
            </h1>
            <p className="portal-subtitle">
              Review received resumes, assess applicants, and update recruitment statuses in real-time.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to="/recruiter-dashboard" className="portal-secondary-btn">
              <ArrowLeft size={16} />
              Recruiter Dashboard
            </Link>
            <Link to="/manage-jobs" className="portal-secondary-btn">
              Manage Jobs
            </Link>
          </div>
        </div>

        {notice && (
          <div className={`portal-alert ${notice.type}`}>{notice.text}</div>
        )}

        {/* Filtered by Job Banner */}
        {filterJobId && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f0f2eb",
              border: "1px solid #d8ddcf",
              padding: "14px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: "var(--color-primary)",
                  fontWeight: 700,
                }}
              >
                Filtered by Job Vacancy
              </span>
              <h3
                style={{
                  margin: "4px 0 0",
                  color: "var(--color-deep)",
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                {targetJob ? `${targetJob.title} (${targetJob.company})` : `Job #${filterJobId}`}
              </h3>
            </div>

            <Link
              to="/applications"
              className="portal-secondary-btn"
              style={{ padding: "7px 14px", fontSize: "13px" }}
            >
              Show All Applications
            </Link>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="portal-filter-bar">
          <div className="portal-filter-group" style={{ flex: 1 }}>
            <Search size={18} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search by candidate name, email, or job title…"
              style={{ width: "min(360px, 100%)" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="portal-filter-group">
            <Filter size={18} color="var(--color-text-muted)" />
            <label htmlFor="status-filter" style={{ fontSize: "13px", fontWeight: 600 }}>
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">
                All Statuses ({filteredApplications.length})
              </option>
              <option value="under review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="portal-empty-state">
            <p>Loading candidate applications…</p>
          </div>
        ) : error ? (
          <div className="portal-empty-state">
            <h3>Unable to load applications</h3>
            <p>{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="portal-empty-state">
            <h3>No applications found</h3>
            <p>
              {searchTerm || statusFilter !== "all" || filterJobId
                ? "No applications matched your active search or filter."
                : "No candidate applications have been received yet."}
            </p>
            {filterJobId && (
              <Link to="/applications" className="portal-primary-btn" style={{ marginTop: "12px" }}>
                View All Applications
              </Link>
            )}
          </div>
        ) : (
          <div className="portal-table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied Position</th>
                  <th>Applied Date</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const statusClass =
                    app.status?.toLowerCase().replace(/\s+/g, "-") ||
                    "under-review";
                  const isUpdating = updatingId === app.id;

                  return (
                    <tr key={app.id}>
                      {/* Candidate info */}
                      <td>
                        <strong>{app.candidateName || "Candidate"}</strong>
                        {app.candidateEmail && (
                          <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                            {app.candidateEmail}
                          </div>
                        )}
                      </td>

                      {/* Job details */}
                      <td>
                        <div>
                          <strong>{app.jobTitle || "Job Opening"}</strong>
                        </div>
                        {app.company && (
                          <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                            {app.company}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td>{app.appliedDate || "N/A"}</td>

                      {/* Current Status Badge */}
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {app.status || "Under Review"}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td>
                        <StatusDropdown
                          status={app.status || "Under Review"}
                          disabled={isUpdating}
                          onChange={(newStatus) =>
                            handleStatusChange(app, newStatus)
                          }
                        />
                      </td>

                      {/* Delete action */}
                      <td>
                        <button
                          type="button"
                          className="portal-danger-btn"
                          title="Delete application"
                          onClick={() =>
                            handleDeleteApplication(app.id, app.candidateName)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Applications;
