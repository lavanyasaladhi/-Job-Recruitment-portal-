import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getApplications, updateApplication, deleteApplication } from "../services/api";
import "./PortalPages.css";

function Applications() {
  const [applicationList, setApplicationList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState(null);

  // Fetch all applications
  useEffect(() => {
    const controller = new AbortController();

    async function loadApplications() {
      setLoading(true);
      setError("");

      try {
        const data = await getApplications({ signal: controller.signal });
        setApplicationList(data);
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

    loadApplications();
    return () => controller.abort();
  }, []);

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
          app.id === application.id ? { ...app, status: updated.status } : app
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
  async function handleDeleteApplication(id, candidateName) {
    const confirmed = window.confirm(
      `Delete application from ${candidateName}?`
    );
    if (!confirmed) return;

    try {
      await deleteApplication(id);
      setApplicationList((prev) => prev.filter((app) => app.id !== id));
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

  // Filter application list based on search and status
  const filteredApplications = applicationList.filter((app) => {
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

          <Link to="/recruiter-dashboard" className="portal-secondary-btn">
            Recruiter Dashboard
          </Link>
        </div>

        {notice && (
          <div className={`portal-alert ${notice.type}`}>{notice.text}</div>
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
              <option value="all">All Statuses ({applicationList.length})</option>
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
              {searchTerm || statusFilter !== "all"
                ? "No applications matched your active search or status filter."
                : "No candidate applications have been received yet."}
            </p>
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
                        <strong>{app.candidateName}</strong>
                        {app.candidateEmail && (
                          <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                            {app.candidateEmail}
                          </div>
                        )}
                      </td>

                      {/* Job details */}
                      <td>
                        <div><strong>{app.jobTitle}</strong></div>
                        <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                          {app.company}
                        </span>
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
                        <select
                          value={app.status || "Under Review"}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(app, e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid var(--color-border)",
                            background: "var(--color-surface)",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
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
