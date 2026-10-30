import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Code,
  Palette,
  Database,
  Terminal,
  Layers,
  BarChart3,
  Building2,
  FileCheck2,
} from "lucide-react";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import { getJobs } from "../services/api";

import "./Home.css";

// Curated backup jobs in case the JSON Server is not yet running

const FALLBACK_FEATURED_JOBS = [
  {
    id: 1,

    title: "Senior React Developer",

    company: "TechNova Labs",

    location: "Hyderabad",

    type: "Full-time",

    experience: 3,

    salary: "14 - 18 LPA",

    skills: ["React", "JavaScript", "TypeScript", "Redux"],
  },

  {
    id: 2,

    title: "UI/UX Product Designer",

    company: "CreativePulse Studio",

    location: "Bengaluru",

    type: "Full-time",

    experience: 2,

    salary: "9 - 13 LPA",

    skills: ["Figma", "Design Systems", "Prototyping"],
  },

  {
    id: 3,

    title: "Full Stack Engineer (React & Node)",

    company: "CloudScale Systems",

    location: "Remote",

    type: "Full-time",

    experience: 4,

    salary: "16 - 22 LPA",

    skills: ["React", "Node.js", "PostgreSQL", "Docker"],
  },
];

const JOB_CATEGORIES = [
  {
    id: "dev",

    title: "Software Engineering",

    description: "Frontend, Backend, Fullstack & Mobile apps",

    icon: Code,

    query: "Developer",

    count: "240+ Open Roles",
  },

  {
    id: "design",

    title: "UI/UX & Product Design",

    description: "Design Systems, User Research & Prototypes",

    icon: Palette,

    query: "Designer",

    count: "95+ Open Roles",
  },

  {
    id: "data",

    title: "Data Science & AI",

    description: "Machine Learning, Analytics & BI Dashboards",

    icon: Database,

    query: "Data",

    count: "130+ Open Roles",
  },

  {
    id: "cloud",

    title: "Cloud & DevOps",

    description: "AWS, Kubernetes, CI/CD & Infrastructure",

    icon: Terminal,

    query: "DevOps",

    count: "80+ Open Roles",
  },

  {
    id: "product",

    title: "Product & Management",

    description: "Product Strategy, Scrum & Technical Delivery",

    icon: Layers,

    query: "Product",

    count: "65+ Open Roles",
  },

  {
    id: "marketing",

    title: "Marketing & Growth",

    description: "Performance Marketing, SEO & Brand Outreach",

    icon: BarChart3,

    query: "Marketing",

    count: "50+ Open Roles",
  },
];

function Home() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [locationTerm, setLocationTerm] = useState("");

  const [featuredJobs, setFeaturedJobs] = useState(FALLBACK_FEATURED_JOBS);

  const [totalJobsCount, setTotalJobsCount] = useState(6);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const jobs = await getJobs();

        if (isMounted && Array.isArray(jobs) && jobs.length > 0) {
          setFeaturedJobs(jobs.slice(0, 3));

          setTotalJobsCount(jobs.length);
        }
      } catch {
        // Fallback
      }
    }

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) params.set("q", searchTerm.trim());

    if (locationTerm.trim()) params.set("location", locationTerm.trim());

    navigate(`/jobs?${params.toString()}`);
  }

  function handleTagClick(query, isLocation = false) {
    const params = new URLSearchParams();

    if (isLocation) {
      params.set("location", query);
    } else {
      params.set("q", query);
    }

    navigate(`/jobs?${params.toString()}`);
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-main">
        {/* ========================================================

SECTION 1: HERO BANNER (Full window size + Mixed-In Stats)

======================================================== */}

        <section className="home-window-section hero-window-section">
          <div className="hero-banner">
            {/* Top row: Content & Search */}

            <div className="hero-top-row">
              <div className="hero-content">
                <h1 className="hero-title">
                  Find the job that <br />
                  <span>fits your future.</span>
                </h1>

                <p className="hero-subtitle">
                  Explore exciting career opportunities, connect directly with
                  employers, and take the next step toward your dream job.
                </p>

                {/* Quick Search Bar */}

                <form className="hero-search-box" onSubmit={handleSearch}>
                  <div className="hero-search-inputs">
                    <div className="hero-input-group">
                      <Search size={18} />

                      <input
                        type="text"

                        placeholder="Job title or keywords"

                        value={searchTerm}

                        onChange={(e) => setSearchTerm(e.target.value)}

                        aria-label="Job title or keywords"
                      />
                    </div>

                    <div className="hero-input-group">
                      <MapPin size={18} />

                      <input
                        type="text"

                        placeholder="Location (e.g. Hyderabad)"

                        value={locationTerm}

                        onChange={(e) => setLocationTerm(e.target.value)}

                        aria-label="Job location"
                      />
                    </div>
                  </div>

                  <button type="submit" className="hero-search-btn">
                    <span>Explore Jobs</span>

                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom row: Mixed-in Stats directly inside the Hero Banner */}

            <div className="hero-stats-row" id="about">
              <div className="hero-stat-card">
                <div className="stat-icon-wrap">
                  <TrendingUp size={26} />
                </div>

                <div className="stat-info">
                  <h3>5,000+</h3>

                  <p>Active Job Vacancies</p>
                </div>
              </div>

              <div className="hero-stat-card">
                <div className="stat-icon-wrap">
                  <Building2 size={26} />
                </div>

                <div className="stat-info">
                  <h3>850+</h3>

                  <p>Verified Hiring Companies</p>
                </div>
              </div>

              <div className="hero-stat-card">
                <div className="stat-icon-wrap">
                  <FileCheck2 size={26} />
                </div>

                <div className="stat-info">
                  <h3>98%</h3>

                  <p>Application Delivery Rate</p>
                </div>
              </div>

              <div className="hero-stat-card">
                <div className="stat-icon-wrap">
                  <Users size={26} />
                </div>

                <div className="stat-info">
                  <h3>15,000+</h3>

                  <p>Community of Job Seekers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================

SECTION 2: EXPLORE BY CATEGORIES (Full Window Size)

======================================================== */}

        <section className="home-window-section">
          <div className="section-panel">
            <div className="section-header">
              <span className="section-badge">Browse By Domain</span>

              <h2 className="section-title">Explore Popular Categories</h2>

              <p className="section-subtitle">
                Target your job search across specialized tech and creative
                sectors with active openings.
              </p>
            </div>

            <div className="categories-grid">
              {JOB_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;

                return (
                  <div
                    key={cat.id}

                    className="category-card"

                    onClick={() => handleTagClick(cat.query)}

                    role="button"

                    tabIndex={0}

                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleTagClick(cat.query);
                      }
                    }}
                  >
                    <div className="category-card-top">
                      <div className="category-icon">
                        <IconComponent size={22} />
                      </div>

                      <ArrowRight size={18} className="category-arrow" />
                    </div>

                    <h4>{cat.title}</h4>

                    <p>{cat.description}</p>

                    <span className="category-count">{cat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================

SECTION 3: FEATURED JOBS SHOWCASE (Full Window Size)

======================================================== */}

        <section className="home-window-section">
          <div className="section-panel">
            <div className="featured-header-row">
              <div className="section-header">
                <span className="section-badge">Recent Postings</span>

                <h2 className="section-title">Featured Opportunities</h2>

                <p className="section-subtitle">
                  Discover recently published roles from leading tech firms and
                  startups.
                </p>
              </div>

              <Link to="/jobs" className="view-all-link">
                <span>View All {totalJobsCount} Jobs</span>

                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="jobs-cards-grid">
              {featuredJobs.map((job) => (
                <article key={job.id} className="featured-job-card">
                  <div className="featured-card-top">
                    <div className="company-badge-avatar">
                      {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                    </div>

                    {job.type && (
                      <span className="job-type-chip">{job.type}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="featured-job-title">{job.title}</h3>

                    <p className="featured-job-company">{job.company}</p>
                  </div>

                  <div className="featured-meta-row">
                    {job.location && (
                      <span className="featured-meta-item">
                        <MapPin size={14} /> {job.location}
                      </span>
                    )}

                    {job.experience !== undefined && (
                      <span className="featured-meta-item">
                        <Briefcase size={14} /> {job.experience} yrs exp
                      </span>
                    )}
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="featured-skills-row">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="featured-skill-tag">
                          {skill}
                        </span>
                      ))}

                      {job.skills.length > 3 && (
                        <span className="featured-skill-tag">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="featured-card-bottom">
                    <div className="featured-salary">
                      <strong>{job.salary || "Competitive"}</strong>

                      <span>Annual CTC / Stipend</span>
                    </div>

                    <Link
                      to={`/jobs/${encodeURIComponent(job.id)}`}

                      className="apply-job-btn"
                    >
                      <span>View Details</span>

                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================

SECTION 4: DUAL PATHWAYS (Full Window Size)

======================================================== */}

        <section className="home-window-section" id="for-employers">
          <div className="section-panel">
            <div className="section-header">
              <span className="section-badge">Platform Highlights</span>

              <h2 className="section-title">Built for Ambitious Job Seekers</h2>

              <p className="section-subtitle">
                A streamlined career platform designed to help you discover
                verified openings and track your hiring journey.
              </p>
            </div>

            <div className="pathways-grid">
              {/* Candidate Card */}

              <div className="pathway-card">
                <span className="pathway-tag">
                  <Users size={16} /> Candidate Portal
                </span>

                <h3>Looking for Your Next Career Move?</h3>

                <p>
                  Create your candidate profile, explore filtered job vacancies,
                  and apply with complete confidence and tracking.
                </p>

                <ul className="pathway-features">
                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Search & filter vacancies by title, location and
                      experience
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Inspect transparent salary expectations, skills and
                      requirements
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Direct candidate registration and single-click job
                      applications
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Real-time status updates on submitted applications
                    </span>
                  </li>
                </ul>

                <div className="pathway-actions">
                  <Link to="/jobs" className="pathway-primary-btn">
                    <span>Browse Jobs Now</span>

                    <ArrowRight size={16} />
                  </Link>

                  <Link to="/login" className="pathway-secondary-btn">
                    <span>Candidate Sign In</span>
                  </Link>
                </div>
              </div>

              {/* Verified Employer Network Card */}

              <div className="pathway-card">
                <span className="pathway-tag">
                  <Building2 size={16} /> Verified Employers
                </span>

                <h3>Partnering With Top Growth Companies</h3>

                <p>
                  Connect directly with leading tech companies and fast-growing
                  teams actively seeking skilled professionals.
                </p>

                <ul className="pathway-features">
                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Verified job listings with clear salary ranges and skills
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Direct application delivery straight to hiring managers
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Comprehensive job descriptions and role expectations
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 size={18} className="feature-check-icon" />

                    <span>
                      Transparent interview stages and prompt application
                      reviews
                    </span>
                  </li>
                </ul>

                <div className="pathway-actions">
                  <Link to="/jobs" className="pathway-primary-btn">
                    <span>Explore Verified Jobs</span>

                    <ArrowRight size={16} />
                  </Link>

                  <Link to="/login" className="pathway-secondary-btn">
                    <span>Create Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================

SECTION 5: HOW IT WORKS (Full Window Size)

======================================================== */}

        <section className="home-window-section" id="how-it-works">
          <div className="section-panel">
            <div className="section-header">
              <span className="section-badge">Streamlined Process</span>

              <h2 className="section-title">How CareerConnect Works</h2>

              <p className="section-subtitle">
                From discovering opportunities to receiving your offer letter in
                four clear steps.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">01</div>

                <h4>Search & Filter</h4>

                <p>
                  Use smart multi-parameter filters to find roles that match
                  your exact location and experience.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">02</div>

                <h4>Review Details</h4>

                <p>
                  Inspect detailed job specifications, tech stack requirements,
                  and salary brackets.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">03</div>

                <h4>Direct Application</h4>

                <p>
                  Submit your profile and resume directly to hiring managers
                  with instant confirmation.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">04</div>

                <h4>Track & Get Hired</h4>

                <p>
                  Stay updated on application milestones and connect directly
                  with hiring teams.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
