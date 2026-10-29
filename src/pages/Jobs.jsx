import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { getJobs } from "../services/api";
import "./jobs.css";

function BriefcaseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h16v11z" />
      <rect x="9" y="11" width="6" height="2" rx="1" />
    </svg>
  );
}

function SearchIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function FilterSlidersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function SearchBar({ keyword, location, onSearch }) {
  const [keywordDraft, setKeywordDraft] = useState(keyword);
  const [locationDraft, setLocationDraft] = useState(location);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(keywordDraft, locationDraft);
  }

  return (
    <form className="jobs-search-card" onSubmit={handleSubmit}>
      <div className="search-input-box">
        <span className="search-box-icon" aria-hidden="true">
          <SearchIcon size={18} />
        </span>
        <div className="search-box-text">
          <label htmlFor="keyword">Job title</label>
          <input
            id="keyword"
            type="text"
            placeholder="e.g. React Developer, Software Engineer"
            value={keywordDraft}
            onChange={(event) => setKeywordDraft(event.target.value)}
          />
        </div>
      </div>

      <div className="search-input-box">
        <span className="search-box-icon" aria-hidden="true">
          <LocationIcon />
        </span>
        <div className="search-box-text">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
            value={locationDraft}
            onChange={(event) => setLocationDraft(event.target.value)}
          />
        </div>
      </div>

      <button className="jobs-search-button" type="submit">
        <SearchIcon size={18} />
        <span>Search Jobs</span>
      </button>
    </form>
  );
}

function FiltersBar({ experience, jobType, onFilterChange, onClear }) {
  return (
    <div className="jobs-filters-card">
      <div className="filters-card-header">
        <span className="filters-header-icon" aria-hidden="true">
          <FilterSlidersIcon />
        </span>
        <h3>Filters</h3>
      </div>

      <div className="filters-card-controls">
        <div className="filter-field">
          <label htmlFor="filter-experience">Experience</label>
          <select
            id="filter-experience"
            value={experience}
            onChange={(event) =>
              onFilterChange("experience", event.target.value)
            }
          >
            <option value="all">Any experience</option>
            <option value="0">Entry level (0 years)</option>
            <option value="1">Up to 1 year</option>
            <option value="2">Up to 2 years</option>
            <option value="3">Up to 3 years</option>
            <option value="5">Up to 5 years</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="filter-jobtype">Job type</label>
          <select
            id="filter-jobtype"
            value={jobType}
            onChange={(event) => onFilterChange("type", event.target.value)}
          >
            <option value="all">All job types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <button
          type="button"
          className="filters-clear-button"
          onClick={onClear}
        >
          <RefreshIcon />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
}

function getExperienceYears(experience) {
  const match = String(experience ?? "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const experience = searchParams.get("experience") || "all";
  const jobType = searchParams.get("type") || "all";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        const result = await getJobs({ signal: controller.signal });
        setJobs(result);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "Unable to load jobs.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJobs();
    return () => controller.abort();
  }, [retryKey]);

  const filteredJobs = useMemo(() => {
    const titleTerm = keyword.trim().toLowerCase();
    const locationTerm = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(titleTerm);
      const matchesLocation = job.location.toLowerCase().includes(locationTerm);
      const years = getExperienceYears(job.experience);
      const matchesExperience =
        experience === "all" ||
        (years !== null && years <= Number(experience));
      const matchesJobType =
        jobType === "all" ||
        job.type.toLowerCase() === jobType.toLowerCase();

      return (
        matchesTitle &&
        matchesLocation &&
        matchesExperience &&
        matchesJobType
      );
    });
  }, [experience, jobType, jobs, keyword, location]);

  function applySearch(keywordDraft, locationDraft) {
    const nextParams = new URLSearchParams(searchParams);
    const nextKeyword = (keywordDraft || "").trim();
    const nextLocation = (locationDraft || "").trim();

    if (nextKeyword) {
      nextParams.set("q", nextKeyword);
    } else {
      nextParams.delete("q");
    }

    if (nextLocation) {
      nextParams.set("location", nextLocation);
    } else {
      nextParams.delete("location");
    }

    setSearchParams(nextParams);
  }

  function updateFilter(name, value) {
    const nextParams = new URLSearchParams(searchParams);
    if (value === "all") {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }
    setSearchParams(nextParams);
  }

  function clearFilters() {
    setSearchParams({});
  }

  return (
    <div className="jobs-page">
      <Navbar />

      <main className="jobs-main">
        {/* Header Section matching mockup */}
        <section className="jobs-heading">
          <div className="jobs-eyebrow-badge">
            <BriefcaseIcon />
            <span>Find Jobs</span>
          </div>
          <h1>Search Your Next Opportunity</h1>
          <p>
            Explore thousands of jobs and take the next step in your career.
          </p>
        </section>

        {/* Stacked Search & Filter Cards matching mockup */}
        <div className="jobs-search-section">
          <SearchBar
            key={`${keyword}\u0000${location}`}
            keyword={keyword}
            location={location}
            onSearch={applySearch}
          />

          <FiltersBar
            experience={experience}
            jobType={jobType}
            onFilterChange={updateFilter}
            onClear={clearFilters}
          />
        </div>

        {/* Results Section with 3 Cards per Line */}
        <section className="jobs-results">
          <div className="jobs-list-section" aria-live="polite">
            <div className="jobs-list-heading">
              <div>
                <h2>Explore opportunities</h2>
                <p>Find a role that fits your future.</p>
              </div>
              {!loading && !error && (
                <span className="job-count">
                  {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="jobs-status" role="status">
                <span className="jobs-spinner" aria-hidden="true" />
                <p>Loading available jobs…</p>
              </div>
            ) : error ? (
              <div className="jobs-status jobs-error" role="alert">
                <h3>We couldn’t load jobs</h3>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => setRetryKey((previous) => previous + 1)}
                >
                  Retry
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="jobs-status">
                <h3>No jobs are available yet</h3>
                <p>Check back later for new opportunities.</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="jobs-empty-state">
                <div className="empty-icon" aria-hidden="true">
                  ⌕
                </div>
                <h3>No matching jobs found</h3>
                <p>Try another search or clear your filters.</p>
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Jobs;
