// Central API Service connecting to JSON Server
// Follows the Food_Ordering_Portal reference implementation using native fetch()
const API_URL = "http://localhost:3000";

// ==========================================
// 1. JOBS API
// ==========================================

// Retrieve all job postings
export const getJobs = async (options = {}) => {
  const response = await fetch(`${API_URL}/jobs`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch jobs (${response.status})`);
  }
  return response.json();
};

// Retrieve a single job posting by ID
export const getJobById = async (id, options = {}) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch job with ID ${id} (${response.status})`);
  }
  return response.json();
};

// Create a new job posting (Recruiter feature)
export const createJob = async (job) => {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!response.ok) {
    throw new Error(`Failed to create job (${response.status})`);
  }
  return response.json();
};

// Update an existing job posting (Recruiter feature)
export const updateJob = async (id, job) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!response.ok) {
    throw new Error(`Failed to update job with ID ${id} (${response.status})`);
  }
  return response.json();
};

// Delete a job posting (Recruiter feature)
export const deleteJob = async (id) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete job with ID ${id} (${response.status})`);
  }
  return response.json();
};

// ==========================================
// 2. CANDIDATES API
// ==========================================

// Retrieve all registered candidates
export const getCandidates = async (options = {}) => {
  const response = await fetch(`${API_URL}/candidates`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch candidates (${response.status})`);
  }
  return response.json();
};

// Retrieve a single candidate by ID
export const getCandidateById = async (id, options = {}) => {
  const response = await fetch(`${API_URL}/candidates/${id}`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch candidate with ID ${id} (${response.status})`);
  }
  return response.json();
};

// Register a new candidate profile
export const createCandidate = async (candidate) => {
  const response = await fetch(`${API_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  if (!response.ok) {
    throw new Error(`Failed to create candidate (${response.status})`);
  }
  return response.json();
};

// ==========================================
// 3. APPLICATIONS API
// ==========================================

// Retrieve all job applications
export const getApplications = async (options = {}) => {
  const response = await fetch(`${API_URL}/applications`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch applications (${response.status})`);
  }
  return response.json();
};

// Retrieve applications submitted by a specific candidate
export const getApplicationsByCandidate = async (candidateId, options = {}) => {
  const response = await fetch(`${API_URL}/applications?candidateId=${candidateId}`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch applications for candidate ${candidateId} (${response.status})`
    );
  }
  const data = await response.json();
  return Array.isArray(data)
    ? data.filter((app) => String(app.candidateId) === String(candidateId))
    : [];
};

// Retrieve applications submitted for a specific job
export const getApplicationsByJob = async (jobId, options = {}) => {
  const response = await fetch(`${API_URL}/applications?jobId=${jobId}`, {
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch applications for job ${jobId} (${response.status})`);
  }
  const data = await response.json();
  return Array.isArray(data)
    ? data.filter((app) => String(app.jobId) === String(jobId))
    : [];
};

// Submit a new application for a job (Candidate feature)
export const createApplication = async (application) => {
  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  if (!response.ok) {
    throw new Error(`Failed to submit application (${response.status})`);
  }
  return response.json();
};

// Update an existing application (e.g. status changed by recruiter)
export const updateApplication = async (id, application) => {
  const response = await fetch(`${API_URL}/applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  if (!response.ok) {
    throw new Error(`Failed to update application with ID ${id} (${response.status})`);
  }
  return response.json();
};

// Delete or withdraw an application
export const deleteApplication = async (id) => {
  const response = await fetch(`${API_URL}/applications/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete application with ID ${id} (${response.status})`);
  }
  return response.json();
};
