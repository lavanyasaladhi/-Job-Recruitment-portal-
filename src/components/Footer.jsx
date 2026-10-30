import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Check } from "lucide-react";
import logoImg from "../assets/logo.png";
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
              <img
                src={logoImg}
                alt="CareerConnect Logo"
                className="footer-logo-img"
              />
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
          <h4>Candidate Portal</h4>
          <ul className="footer-links">
            <li>
              <Link to="/jobs">Explore All Jobs</Link>
            </li>
            <li>
              <Link to="/jobs?type=Remote">Remote Positions</Link>
            </li>
            <li>
              <Link to="/register">Candidate Registration</Link>
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
          <h4>Explore Careers</h4>
          <ul className="footer-links">
            <li>
              <Link to="/jobs">Search Positions</Link>
            </li>
            <li>
              <Link to="/jobs?experience=0">Fresher Opportunities</Link>
            </li>
            <li>
              <Link to="/jobs?type=Full-time">Full-time Roles</Link>
            </li>
            <li>
              <Link to="/jobs?type=Hybrid">Hybrid Positions</Link>
            </li>
            <li>
              <Link to="/login">Create Account</Link>
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
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
