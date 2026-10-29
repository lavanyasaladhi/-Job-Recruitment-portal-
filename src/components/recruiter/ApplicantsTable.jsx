
import "./ApplicantsTable.css";

function ApplicantsTable({ applicants = [], onStatusChange, onViewResume }) {
  return (
    <div className="applicants-table-card">
      <div className="applicants-table-header">
        <div>
          <h2>Job Applicants</h2>
          <p>Review candidates and track their application status.</p>
        </div>

        <span className="applicants-count">
          {applicants.length} Applicants
        </span>
      </div>

      <div className="applicants-table-wrapper">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Experience</th>
              <th>Resume</th>
              <th>Application Status</th>
            </tr>
          </thead>

          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>
                    <div className="applicant-name">
                      {applicant.name || applicant.candidateName || "Unknown"}
                    </div>
                    <div className="applicant-email">
                      {applicant.email || ""}
                    </div>
                  </td>

                  <td>
                    {applicant.experience ?? 0} years
                  </td>

                  <td>
                    {applicant.resumeUrl ? (
                      <button
                        type="button"
                        className="resume-link"
                        onClick={() => onViewResume?.(applicant)}
                      >
                        View Resume
                      </button>
                    ) : (
                      <span className="resume-unavailable">
                        Not available
                      </span>
                    )}
                  </td>

                  <td>
                    <select
                      className="applicant-status-select"
                      value={applicant.status || "Pending"}
                      onChange={(e) =>
                        onStatusChange?.(applicant.id, e.target.value)
                      }
                      aria-label={`Update status for ${applicant.name || "applicant"}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Selected">Selected</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="applicants-empty">
                  No applications received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplicantsTable;
