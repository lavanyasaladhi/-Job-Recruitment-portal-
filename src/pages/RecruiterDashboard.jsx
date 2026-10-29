import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Clock, CheckCircle, PlusCircle, List } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobs, getApplications } from "../services/api";
import "./PortalPages.css";

function RecruiterDashboard() {
  const [jobList, setJobList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch summary data for jobs and applications
  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardData() {
      setLoading(true);
      setError("");

      try {
        const [jobsData, appsData] = await Promise.all([
          getJobs({ signal: controller.signal }),
          getApplications({ signal: controller.signal }),
        ]);

        setJobList(jobsData);
        setApplicationList(appsData);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load dashboard metrics.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();
    return () => controller.abort();
  }, []);

  // Compute metrics
  const totalJobs = jobList.length;
  const totalApplications = applicationList.length;
  const pendingReview = applicationList.filter(
    (app) => app.status === "Under Review"
  ).length;
  const shortlisted = applicationList.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  return (
    <div>
      <Navbar />

      <main className="portal-container">
        <div className="portal-header-row">
          <div>
            <span className="portal-eyebrow-tag">Recruiter Workspace</span>
            <h1 className="portal-title">
              Recruiter <span>Dashboard</span>
            </h1>
            <p className="portal-subtitle">
              Overview of your active hiring pipelines, candidate applications, and job vacancies.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/add-job" className="portal-primary-btn">
              <PlusCircle size={18} />
              Post New Job
            </Link>
            <Link to="/manage-jobs" className="portal-secondary-btn">
              <List size={18} />
              Manage Jobs
            </Link>
          </div>
        </div>

        {error && <div className="portal-alert error">{error}</div>}

        {/* Quick Statistics Grid */}
        <div className="portal-stats-grid">
          <div className="portal-stat-card">
            <div className="portal-stat-icon">
              <Briefcase size={24} />
            </div>
            <div className="portal-stat-content">
              <h3>{loading ? "…" : totalJobs}</h3>
              <p>Active Job Vacancies</p>
            </div>
          </div>

          <div className="portal-stat-card">
            <div className="portal-stat-icon">
              <Users size={24} />
            </div>
            <div className="portal-stat-content">
              <h3>{loading ? "…" : totalApplications}</h3>
              <p>Applications Received</p>
            </div>
          </div>

          <div className="portal-stat-card">
            <div className="portal-stat-icon">
              <Clock size={24} />
            </div>
            <div className="portal-stat-content">
              <h3>{loading ? "…" : pendingReview}</h3>
              <p>Pending Under Review</p>
            </div>
          </div>

          <div className="portal-stat-card">
            <div className="portal-stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="portal-stat-content">
              <h3>{loading ? "…" : shortlisted}</h3>
              <p>Shortlisted Candidates</p>
            </div>
          </div>
        </div>

        {/* Quick Management Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          <div className="portal-card">
            <h2 style={{ fontSize: "18px", color: "var(--color-deep)", marginBottom: "8px" }}>
              Job Postings Management
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "18px" }}>
              Add new job descriptions, update requirements, or close expired vacancies.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/add-job" className="portal-primary-btn" style={{ padding: "8px 14px", fontSize: "13px" }}>
                Add Job
              </Link>
              <Link to="/manage-jobs" className="portal-secondary-btn" style={{ padding: "8px 14px", fontSize: "13px" }}>
                View All Jobs ({totalJobs})
              </Link>
            </div>
          </div>

          <div className="portal-card">
            <h2 style={{ fontSize: "18px", color: "var(--color-deep)", marginBottom: "8px" }}>
              Review Candidate Applications
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "18px" }}>
              Evaluate candidate profiles and move them through review, shortlist, or hire stages.
            </p>
            <Link to="/applications" className="portal-primary-btn" style={{ padding: "8px 14px", fontSize: "13px" }}>
              Review Applications ({totalApplications}) →
            </Link>
          </div>
        </div>

        {/* Recent Applications Preview */}
        <section className="portal-card">
          <div className="portal-header-row" style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--color-deep)" }}>
              Recent Applications
            </h2>
            <Link to="/applications" className="portal-secondary-btn" style={{ padding: "6px 12px", fontSize: "13px" }}>
              View All Applications →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "var(--color-text-muted)" }}>Loading applications…</p>
          ) : applicationList.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>No applications have been received yet.</p>
          ) : (
            <div className="portal-table-container">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position Applied</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationList.slice(0, 5).map((app) => {
                    const statusClass =
                      app.status?.toLowerCase().replace(/\s+/g, "-") || "under-review";

                    return (
                      <tr key={app.id}>
                        <td>
                          <strong>{app.candidateName}</strong>
                          {app.candidateEmail && (
                            <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                              {app.candidateEmail}
                            </div>
                          )}
                        </td>
                        <td>{app.jobTitle}</td>
                        <td>{app.appliedDate}</td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default RecruiterDashboard;
