import "./ApplicantsTable.css";
import StatusDropdown from "./StatusDropdown";

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
              <th>Position / Applied Date</th>
              <th>Resume / Cover Note</th>
              <th>Application Status</th>
            </tr>
          </thead>

          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>
                    <div className="applicant-name">
                      {applicant.candidateName || applicant.name || "Candidate"}
                    </div>
                    <div className="applicant-email">
                      {applicant.candidateEmail || applicant.email || ""}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {applicant.jobTitle || "Job Application"}
                    </div>
                    {applicant.appliedDate && (
                      <small style={{ color: "var(--color-text-muted, #536863)" }}>
                        Applied: {applicant.appliedDate}
                      </small>
                    )}
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
                    ) : applicant.coverLetter ? (
                      <span
                        title={applicant.coverLetter}
                        style={{ fontSize: "12px", color: "var(--color-text-muted, #536863)" }}
                      >
                        {applicant.coverLetter.length > 40
                          ? applicant.coverLetter.slice(0, 40) + "…"
                          : applicant.coverLetter}
                      </span>
                    ) : (
                      <span className="resume-unavailable">
                        Not available
                      </span>
                    )}
                  </td>

                  <td>
                    <StatusDropdown
                      status={applicant.status || "Under Review"}
                      onChange={(newStatus) =>
                        onStatusChange?.(applicant.id, newStatus)
                      }
                    />
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
