
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusCard from "../components/recruiter/StatusCard";
import RecruiterJobTable from "../components/recruiter/RecruiterJobTable";
import ConfirmDialog from "../components/recruiter/ConfirmDialog";
import { getJobs, getApplications, deleteJob } from "../services/api";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [jobsData, applicationsData] = await Promise.all([
          getJobs({ signal: controller.signal }),
          getApplications({ signal: controller.signal }),
        ]);

        setJobs(jobsData);
        setApplications(applicationsData);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load dashboard.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadDashboard();
    return () => controller.abort();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedJob) return;

    try {
      setError("");
      await deleteJob(selectedJob.id);
      setJobs((current) =>
        current.filter((job) => job.id !== selectedJob.id)
      );
      setShowDeleteDialog(false);
      setSelectedJob(null);
    } catch (err) {
      setError(err.message || "Failed to delete job.");
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="recruiter-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Recruiter Workspace</p>
          <h1>Recruiter Dashboard</h1>
          <p>Manage your job postings and track applications.</p>
        </div>

        <button
          className="dashboard-add-button"
          onClick={() => navigate("/add-job")}
        >
          Add New Job
        </button>
      </header>

      {error && <p role="alert">{error}</p>}

      <section className="dashboard-stats">
        <StatusCard
          title="Total Jobs"
          count={loading ? "..." : jobs.length}
          icon="💼"
        />
        <StatusCard
          title="Total Applications"
          count={loading ? "..." : applications.length}
          icon="📄"
        />
        <StatusCard
          title="Active Jobs"
          count={
            loading
              ? "..."
              : jobs.filter((job) => job.status?.toLowerCase() === "active").length
          }
          icon="🟢"
        />
      </section>

      <section className="dashboard-jobs-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Your Job Postings</h2>
            <p>Review and manage your published opportunities.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <RecruiterJobTable
            jobs={jobs}
            onEdit={(job) => navigate(`/edit-job/${job.id}`)}
            onDelete={(job) => {
              setSelectedJob(job);
              setShowDeleteDialog(true);
            }}
            onViewApplicants={(job) =>
              navigate(`/applications/${job.id}`)
            }
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Job?"
        message={`Are you sure you want to delete "${selectedJob?.title ?? "this job"}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
}

export default RecruiterDashboard;
