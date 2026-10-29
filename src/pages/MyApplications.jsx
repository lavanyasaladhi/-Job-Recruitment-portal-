import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getApplications, deleteApplication } from "../services/api";
import { useAuth } from "../context/useAuth";
import "./PortalPages.css";

function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");
  const [actionNotice, setActionNotice] = useState(null);

  // Load candidate applications only if logged in
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();

    async function fetchMyApplications() {
      setLoading(true);
      setError("");

      try {
        const allApplications = await getApplications({
          signal: controller.signal,
        });

        // Filter for current user's applications
        const userApps = allApplications.filter(
          (app) =>
            app.candidateEmail?.toLowerCase() === user.email?.toLowerCase()
        );

        setApplications(userApps.length > 0 ? userApps : allApplications);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load your applications.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMyApplications();
    return () => controller.abort();
  }, [user]);

  // Handle withdrawing an application
  async function handleWithdraw(id, jobTitle) {
    const confirmed = window.confirm(
      `Are you sure you want to withdraw your application for "${jobTitle}"?`
    );
    if (!confirmed) return;

    try {
      await deleteApplication(id);
      // Remove from local state
      setApplications((previous) => previous.filter((app) => app.id !== id));
      setActionNotice({
        type: "success",
        text: `Application for "${jobTitle}" was successfully withdrawn.`,
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      setActionNotice({
        type: "error",
        text: err.message || "Failed to withdraw application.",
      });
    }
  }

  // If user is not logged in, prompt to sign in
  if (!user) {
    return (
      <div>
        <Navbar />
        <main
          className="portal-container"
          style={{ textAlign: "center", padding: "80px 20px" }}
        >
          <span className="portal-eyebrow-tag">Access Restricted</span>
          <h1 className="portal-title" style={{ margin: "12px 0" }}>
            Sign In to View <span>Applications</span>
          </h1>
          <p className="portal-subtitle" style={{ margin: "0 auto 24px auto" }}>
            You need to be signed in to your candidate profile to track and manage your job applications.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <Link to="/login" className="portal-primary-btn">
              Sign In Now →
            </Link>
            <Link to="/jobs" className="portal-secondary-btn">
              Browse Open Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="portal-container">
        <div className="portal-header-row">
          <div>
            <span className="portal-eyebrow-tag">Candidate Tracker</span>
            <h1 className="portal-title">
              My Job <span>Applications</span>
            </h1>
            <p className="portal-subtitle">
              Track the progress of your submitted job applications and review decisions in real-time.
            </p>
          </div>

          <Link to="/jobs" className="portal-primary-btn">
            Browse More Jobs →
          </Link>
        </div>

        {actionNotice && (
          <div className={`portal-alert ${actionNotice.type}`}>
            {actionNotice.text}
          </div>
        )}

        {loading ? (
          <div className="portal-empty-state">
            <p>Loading your applications…</p>
          </div>
        ) : error ? (
          <div className="portal-empty-state">
            <h3>Unable to load applications</h3>
            <p>{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="portal-empty-state">
            <h3>No applications yet</h3>
            <p>
              You haven't submitted any job applications yet. Browse through our open vacancies and find your dream role!
            </p>
            <Link to="/jobs" className="portal-primary-btn">
              Explore Available Jobs
            </Link>
          </div>
        ) : (
          <div className="portal-table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const statusClass =
                    app.status?.toLowerCase().replace(/\s+/g, "-") ||
                    "under-review";

                  return (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.jobTitle}</strong>
                      </td>
                      <td>{app.company || "Company"}</td>
                      <td>{app.appliedDate || "N/A"}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {app.status || "Under Review"}
                        </span>
                      </td>
                      <td>
                        <div className="portal-actions-cell">
                          {app.jobId && (
                            <Link
                              to={`/jobs/${app.jobId}`}
                              className="portal-secondary-btn"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              View Job
                            </Link>
                          )}
                          <button
                            type="button"
                            className="portal-danger-btn"
                            onClick={() => handleWithdraw(app.id, app.jobTitle)}
                          >
                            Withdraw
                          </button>
                        </div>
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

export default MyApplications;
