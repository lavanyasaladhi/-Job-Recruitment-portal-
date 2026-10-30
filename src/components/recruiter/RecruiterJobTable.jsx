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
              jobs.map((job) => {
                const experienceLabel =
                  job.minExperience !== undefined &&
                  job.maxExperience !== undefined &&
                  job.minExperience !== job.maxExperience
                    ? `${job.minExperience}–${job.maxExperience} yrs`
                    : job.minExperience !== undefined && job.minExperience > 0
                    ? `${job.minExperience}+ yrs`
                    : job.experience
                    ? `${job.experience} yrs`
                    : "Fresher";

                return (
                  <tr key={job.id}>
                    <td>
                      <span className="job-title">
                        {job.title}
                      </span>
                      {job.company && (
                        <div style={{ fontSize: "12px", color: "#686a60", marginTop: "2px" }}>
                          {job.company}
                        </div>
                      )}
                    </td>

                    <td>
                      <div>{job.location || "Not specified"}</div>
                      {(job.type || job.jobType) && (
                        <span style={{ fontSize: "11px", color: "#636b2f", fontWeight: 600 }}>
                          {job.type || job.jobType}
                        </span>
                      )}
                    </td>

                    <td>{experienceLabel}</td>

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
                );
              })
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
