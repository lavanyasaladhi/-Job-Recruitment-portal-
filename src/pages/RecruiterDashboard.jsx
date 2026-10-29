
import { useState } from "react";
import StatusCard from "../components/recruiter/StatusCard";
import RecruiterJobTable from "../components/recruiter/RecruiterJobTable";
import ConfirmDialog from "../components/recruiter/ConfirmDialog";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([
  {
    id: 1,
    title: "Frontend Developer",
    location: "Hyderabad",
    minExperience: 0,
    maxExperience: 2,
  },
]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setJobs((currentJobs) =>
      currentJobs.filter((job) => job.id !== selectedJob?.id)
    );
    setShowDeleteDialog(false);
    setSelectedJob(null);
  };

  return (
    <div className="recruiter-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow"></p>
          <h1>Recruiter Dashboard</h1>
          <p>Manage your job postings and track applications.</p>
        </div>

        <button
          className="dashboard-add-button"
          onClick={() => {
            window.location.href = "/add-job";
          }}
        >
          Add New
        </button>
      </header>

      <section className="dashboard-stats">
        <StatusCard
          title="Total Jobs"
          count={jobs.length}
          icon="💼"
        />

        <StatusCard
          title="Total Applications"
          count="—"
          icon="📄"
        />

        <StatusCard
          title="Active Jobs"
          count={jobs.length}
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

        <RecruiterJobTable
          jobs={jobs}
          onEdit={(job) => {
            window.location.href = `/edit-job/${job.id}`;
          }}
          onDelete={handleDeleteClick}
          onViewApplicants={(job) => {
            window.location.href = `/applications/${job.id}`;
          }}
        />
      </section>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Job?"
        message={`Are you sure you want to delete "${selectedJob?.title ?? "this job"}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}

export default RecruiterDashboard;
