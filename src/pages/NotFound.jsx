import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PortalPages.css";

function NotFound() {
  return (
    <div>
      <Navbar />

      <main className="portal-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <span className="portal-eyebrow-tag">Error 404</span>
        <h1 className="portal-title" style={{ fontSize: "56px", margin: "12px 0" }}>
          Page <span>Not Found</span>
        </h1>
        <p className="portal-subtitle" style={{ margin: "0 auto 28px auto" }}>
          The page you are looking for does not exist, has been moved, or is temporarily unavailable.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <Link to="/" className="portal-primary-btn">
            Return to Home
          </Link>
          <Link to="/jobs" className="portal-secondary-btn">
            Explore Open Jobs
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;
