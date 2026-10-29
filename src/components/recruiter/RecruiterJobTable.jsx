
import "./RecruiterJobTable.css";

function RecruiterJobTable({
  jobs = [],
  onEdit,
  onDelete,
  onViewApplicants,
}) {
  return (
    <div className="recruiter-table-card">
      <div className="recruiter-table-header">
        <div>
          <h2>Manage Jobs</h2>
          <p>View and manage your job postings</p>
        </div>

        <span className="job-count">
          {jobs.length} Jobs
        </span>
      </div>

      <div className="recruiter-table-wrapper">
        <table className="recruiter-job-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <span className="job-title">
                      {job.title}
                    </span>
                  </td>

                  <td>{job.location || "Not specified"}</td>

                  <td>
                    {job.minExperience ?? 0}–{job.maxExperience ?? 0} years
                  </td>

                  <td>
                    <div className="job-actions">
                      <button
                        className="job-action-btn edit-btn"
                        onClick={() => onEdit?.(job)}
                      >
                        Edit
                      </button>

                      <button
                        className="job-action-btn applicants-btn"
                        onClick={() => onViewApplicants?.(job)}
                      >
                        Applicants
                      </button>

                      <button
                        className="job-action-btn delete-btn"
                        onClick={() => onDelete?.(job)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-jobs">
                  No jobs posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecruiterJobTable;
