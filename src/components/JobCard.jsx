import "./JobCard.css";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        {job.company && (
          <div className="company-avatar" aria-hidden="true">
            {job.company.charAt(0)}
          </div>
        )}

        {job.type && <span className="job-type">{job.type}</span>}
      </div>

      <div className="job-card-content">
        <h3>{job.title}</h3>
        {job.company && <p className="job-company">{job.company}</p>}

        <div className="job-meta">
          {job.location && <span>📍 {job.location}</span>}
          {job.experience !== "" && job.experience !== undefined && (
            <span>◷ {job.experience} years experience</span>
          )}
          {job.postedDate && <span>Posted {job.postedDate}</span>}
        </div>

        {job.skills.length > 0 && (
          <div className="job-skills">
            {job.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        )}
      </div>

      <div className="job-card-bottom">
        {job.salary ? (
          <div>
            <strong>{job.salary}</strong>
            <p>Salary / stipend</p>
          </div>
        ) : (
          <span className="job-salary-unavailable">Salary not listed</span>
        )}
        <Link
          className="view-job-button"
          to={`/jobs/${encodeURIComponent(job.id)}`}
          aria-label={`View details for ${job.title}`}
        >
          View details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default JobCard;
