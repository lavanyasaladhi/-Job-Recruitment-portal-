import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { getJobs } from "../services/api";
import "./jobs.css";

function SearchBar({
  keyword,
  location,
  experience,
  jobType,
  onSearch,
  onClear,
}) {
  const [keywordDraft, setKeywordDraft] = useState(keyword);
  const [locationDraft, setLocationDraft] = useState(location);
  const [showFilters, setShowFilters] = useState(false);

  // Count how many filter criteria are currently active
  const activeFilterCount =
    (experience !== "all" ? 1 : 0) + (jobType !== "all" ? 1 : 0);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(keywordDraft, locationDraft, experience, jobType);
  }

  function handleExperienceChange(event) {
    const nextExperience = event.target.value;
    onSearch(keywordDraft, locationDraft, nextExperience, jobType);
  }

  function handleJobTypeChange(event) {
    const nextJobType = event.target.value;
    onSearch(keywordDraft, locationDraft, experience, nextJobType);
  }

  function handleClearKeyword() {
    setKeywordDraft("");
    onSearch("", locationDraft, experience, jobType);
  }

  function handleClearLocation() {
    setLocationDraft("");
    onSearch(keywordDraft, "", experience, jobType);
  }

  function handleClearAll() {
    setKeywordDraft("");
    setLocationDraft("");
    onClear();
  }

  return (
    <div className="jobs-search-container">
      <form className="jobs-search-panel" onSubmit={handleSubmit}>
        <div className="search-field">
          <label htmlFor="keyword">Job title</label>
          <input
            id="keyword"
            type="search"
            placeholder="e.g. React Developer"
            value={keywordDraft}
            onChange={(event) => setKeywordDraft(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="search"
            placeholder="e.g. Hyderabad"
            value={locationDraft}
            onChange={(event) => setLocationDraft(event.target.value)}
          />
        </div>

        <button className="jobs-search-button" type="submit">
          Search Jobs
        </button>

        <button
          type="button"
          className={`jobs-filter-toggle ${showFilters || activeFilterCount > 0 ? "active" : ""}`}
          onClick={() => setShowFilters((previous) => !previous)}
          aria-expanded={showFilters}
          title="Toggle filter options"
        >
          <span className="filter-icon" aria-hidden="true">
            ⚙
          </span>
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
          <span className="filter-chevron" aria-hidden="true">
            {showFilters ? "▲" : "▼"}
          </span>
        </button>
      </form>

      {/* Expandable filter options directly below the search bar */}
      {showFilters && (
        <div className="jobs-filter-drawer">
          <div className="filter-drawer-header">
            <h4>Filter options</h4>
            <span className="filter-drawer-hint">
              Refine listings by required experience and job type
            </span>
          </div>

          <div className="filter-drawer-controls">
            <div className="filter-control">
              <label htmlFor="filter-experience">Experience</label>
              <select
                id="filter-experience"
                value={experience}
                onChange={handleExperienceChange}
              >
                <option value="all">Any experience</option>
                <option value="0">Entry level (0 years)</option>
                <option value="1">Up to 1 year</option>
                <option value="2">Up to 2 years</option>
                <option value="3">Up to 3 years</option>
                <option value="5">Up to 5 years</option>
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="filter-jobtype">Job type</label>
              <select
                id="filter-jobtype"
                value={jobType}
                onChange={handleJobTypeChange}
              >
                <option value="all">All job types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                className="clear-drawer-filters"
                onClick={() => {
                  onSearch(keywordDraft, locationDraft, "all", "all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Removable active filter tags */}
      {(keyword || location || activeFilterCount > 0) && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Active filters:</span>
          {keyword && (
            <span className="filter-pill">
              Title: {keyword}
              <button
                type="button"
                onClick={handleClearKeyword}
                aria-label="Remove title filter"
              >
                ×
              </button>
            </span>
          )}
          {location && (
            <span className="filter-pill">
              Location: {location}
              <button
                type="button"
                onClick={handleClearLocation}
                aria-label="Remove location filter"
              >
                ×
              </button>
            </span>
          )}
          {experience !== "all" && (
            <span className="filter-pill">
              Exp: {experience === "0" ? "Entry level" : `≤ ${experience} yrs`}
              <button
                type="button"
                onClick={() =>
                  onSearch(keywordDraft, locationDraft, "all", jobType)
                }
                aria-label="Remove experience filter"
              >
                ×
              </button>
            </span>
          )}
          {jobType !== "all" && (
            <span className="filter-pill">
              Type: {jobType}
              <button
                type="button"
                onClick={() =>
                  onSearch(keywordDraft, locationDraft, experience, "all")
                }
                aria-label="Remove job type filter"
              >
                ×
              </button>
            </span>
          )}
          <button
            type="button"
            className="clear-all-pills"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        </div>
      )}
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

  function applySearch(keywordDraft, locationDraft, nextExperience, nextJobType) {
    const nextParams = new URLSearchParams();
    const nextKeyword = (keywordDraft || "").trim();
    const nextLocation = (locationDraft || "").trim();

    if (nextKeyword) nextParams.set("q", nextKeyword);
    if (nextLocation) nextParams.set("location", nextLocation);
    if (nextExperience && nextExperience !== "all") {
      nextParams.set("experience", nextExperience);
    }
    if (nextJobType && nextJobType !== "all") {
      nextParams.set("type", nextJobType);
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
        <section className="jobs-heading">
          <span className="jobs-eyebrow">YOUR NEXT CHAPTER</span>
          <h1>
            Find your <span>perfect job.</span>
          </h1>
          <p>
            Explore opportunities that match your skills, experience, and
            ambitions.
          </p>
        </section>

        <SearchBar
          key={`${keyword}\u0000${location}\u0000${experience}\u0000${jobType}`}
          keyword={keyword}
          location={location}
          experience={experience}
          jobType={jobType}
          onSearch={applySearch}
          onClear={clearFilters}
        />

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
