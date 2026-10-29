// Base API URL pointing to JSON Server or mock server
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

// Helper to pick first non-empty value
function firstAvailable(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );
}

// Normalizes a job record so UI always has consistent properties
function normalizeJob(job) {
  if (!job || typeof job !== "object" || job.id === undefined || job.id === null) {
    throw new Error("A job record is missing its ID.");
  }

  const title = firstAvailable(job.title, job.jobTitle, job.position);
  if (!title) {
    throw new Error(`Job ${job.id} is missing its title.`);
  }

  const skills = firstAvailable(job.skills, job.requiredSkills);

  return {
    ...job,
    id: job.id,
    title: String(title),
    company: firstAvailable(job.company, job.companyName, ""),
    location: firstAvailable(job.location, job.workLocation, ""),
    type: firstAvailable(job.type, job.jobType, "Full-time"),
    experience: firstAvailable(
      job.experience,
      job.requiredExperience,
      job.experienceRequired,
      0
    ),
    salary: firstAvailable(job.salary, job.salaryRange, ""),
    postedDate: firstAvailable(job.postedDate, job.postedAt, job.postingDate, ""),
    description: job.description || "",
    skills: Array.isArray(skills)
      ? skills
      : typeof skills === "string"
        ? skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
  };
}

// ==========================================
// 1. JOBS API FUNCTIONS
// ==========================================

// Get all jobs
export async function getJobs({ signal } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(normalizeJob);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      `Could not connect to jobs API at ${API_BASE_URL}. Please ensure the server is running.`
    );
  }
}

// Get single job by ID
export async function getJobById(id, { signal } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Job not found (${response.status})`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(error.message || `Could not fetch job with ID ${id}`);
  }
}

// Create a new job
export async function createJob(jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create job (${response.status})`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    throw new Error(error.message || "Failed to post job.");
  }
}

// Update an existing job
export async function updateJob(id, jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update job (${response.status})`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    throw new Error(error.message || `Failed to update job with ID ${id}`);
  }
}

// Delete a job
export async function deleteJob(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete job (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || `Failed to delete job with ID ${id}`);
  }
}

// ==========================================
// 2. CANDIDATES API FUNCTIONS
// ==========================================

// Get all candidates
export async function getCandidates({ signal } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidates (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Could not connect to candidates API.");
  }
}

// Get candidate by ID
export async function getCandidateById(id, { signal } = {}) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/candidates/${encodeURIComponent(id)}`,
      {
        headers: { Accept: "application/json" },
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Candidate not found (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(error.message || "Failed to load candidate details.");
  }
}

// Register a new candidate
export async function createCandidate(candidateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(candidateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to register candidate (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to create candidate profile.");
  }
}

// ==========================================
// 3. APPLICATIONS API FUNCTIONS
// ==========================================

// Get all job applications
export async function getApplications({ signal } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch applications (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Could not connect to applications API.");
  }
}

// Apply for a job (create application)
export async function createApplication(applicationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit application (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to submit job application.");
  }
}

// Update application (e.g. status changed by recruiter)
export async function updateApplication(id, updatedData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update application (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update application.");
  }
}

// Delete / withdraw application
export async function deleteApplication(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete application (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to withdraw application.");
  }
}
