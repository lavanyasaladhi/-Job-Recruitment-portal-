import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import JobCard from "../components/JobCard";
import { getJobs } from "../services/api";
import "./jobs.css";

function SearchBar({ keyword, location, onSearch }) {
  const [keywordDraft, setKeywordDraft] = useState(keyword);
  const [locationDraft, setLocationDraft] = useState(location);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(keywordDraft, locationDraft);
  }

  return (
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
    </form>
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
    const nextParams = new URLSearchParams();
    const nextKeyword = keywordDraft.trim();
    const nextLocation = locationDraft.trim();

    if (nextKeyword) nextParams.set("q", nextKeyword);
    if (nextLocation) nextParams.set("location", nextLocation);
    if (experience !== "all") nextParams.set("experience", experience);
    if (jobType !== "all") nextParams.set("type", jobType);

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
          key={`${keyword}\u0000${location}`}
          keyword={keyword}
          location={location}
          onSearch={applySearch}
        />

        <section className="jobs-results">
          <aside className="jobs-filters" aria-label="Filter jobs">
            <h2>Filters</h2>

            <div className="filter-group">
              <label htmlFor="experience">Experience</label>
              <select
                id="experience"
                value={experience}
                onChange={(event) =>
                  updateFilter("experience", event.target.value)
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

            <div className="filter-group">
              <label htmlFor="jobType">Job type</label>
              <select
                id="jobType"
                value={jobType}
                onChange={(event) => updateFilter("type", event.target.value)}
              >
                <option value="all">All job types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <button
              className="clear-filters"
              type="button"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </aside>

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
