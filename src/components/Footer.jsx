import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Send, Check } from "lucide-react";
import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">
              <Briefcase size={20} strokeWidth={2.4} />
            </span>
            <span>CareerConnect</span>
          </Link>
          <p className="footer-tagline">
            Connecting passionate professionals with high-growth companies.
            Streamlined job discovery, direct employer applications, and transparent hiring.
          </p>
          <div className="footer-stats-badge">
            Over 5,000+ career milestones delivered
          </div>
        </div>

        <div className="footer-col">
          <h4>For Candidates</h4>
          <ul className="footer-links">
            <li>
              <Link to="/jobs">Explore All Jobs</Link>
            </li>
            <li>
              <Link to="/jobs?type=Remote">Remote Positions</Link>
            </li>
            <li>
              <Link to="/candidate-register">Candidate Registration</Link>
            </li>
            <li>
              <Link to="/my-applications">My Applications</Link>
            </li>
            <li>
              <Link to="/login">Candidate Sign In</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>For Recruiters</h4>
          <ul className="footer-links">
            <li>
              <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>
            </li>
            <li>
              <Link to="/add-job">Post a Vacancy</Link>
            </li>
            <li>
              <Link to="/manage-jobs">Manage Jobs</Link>
            </li>
            <li>
              <Link to="/applications">Review Applications</Link>
            </li>
            <li>
              <Link to="/login">Recruiter Portal</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>Job Alerts & Updates</h4>
          <p>
            Get curated weekly openings and career insights delivered right to your inbox.
          </p>
          <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              {subscribed ? <Check size={18} /> : <Send size={18} />}
            </button>
          </form>
          {subscribed && (
            <p className="newsletter-success">
              ✓ Subscribed! You will receive new opportunities.
            </p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CareerConnect Portal. Built for L&T Recruitment System.</p>
        <div className="footer-bottom-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/recruiter-dashboard">Recruiter</Link>
          <Link to="/candidate-register">Register</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
