const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const dbPath = path.join(__dirname, "db.json");

// Helper function to read data from db.json
function getDbData() {
  try {
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading db.json:", error);
  }
  return { jobs: [], candidates: [], applications: [] };
}

// Helper function to write data to db.json
function saveDbData(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
}

// Helper function to parse JSON body from incoming request
function parseRequestBody(request) {
  return new Promise((resolve) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Create HTTP server
const server = http.createServer(async (request, response) => {
    // Set CORS headers so React frontend can connect
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Content-Type", "application/json");

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return;
    }

    const db = getDbData();
    const parsedUrl = new URL(request.url, "http://localhost:3000");
    const pathname = parsedUrl.pathname;
    const method = request.method;

    // Ensure collections exist
    if (!Array.isArray(db.jobs)) db.jobs = [];
    if (!Array.isArray(db.candidates)) db.candidates = [];
    if (!Array.isArray(db.applications)) db.applications = [];

    // ==========================================
    // 1. JOBS ENDPOINTS
    // ==========================================
    if (pathname === "/jobs") {
      if (method === "GET") {
        response.end(JSON.stringify(db.jobs));
        return;
      }

      if (method === "POST") {
        const body = await parseRequestBody(request);
        const newJob = {
          id: body.id || (db.jobs.length > 0 ? Math.max(...db.jobs.map((j) => Number(j.id) || 0)) + 1 : 1),
          title: body.title || "",
          company: body.company || "",
          location: body.location || "",
          type: body.type || "Full-time",
          experience: Number(body.experience) || 0,
          salary: body.salary || "",
          postedDate: body.postedDate || new Date().toISOString().split("T")[0],
          skills: Array.isArray(body.skills) ? body.skills : [],
          description: body.description || "",
        };

        db.jobs.push(newJob);
        saveDbData(db);

        response.statusCode = 201;
        response.end(JSON.stringify(newJob));
        return;
      }
    }

    const jobMatch = pathname.match(/^\/jobs\/(.+)$/);
    if (jobMatch) {
      const jobId = decodeURIComponent(jobMatch[1]);
      const jobIndex = db.jobs.findIndex((item) => String(item.id) === jobId);

      if (method === "GET") {
        if (jobIndex !== -1) {
          response.end(JSON.stringify(db.jobs[jobIndex]));
        } else {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Job not found" }));
        }
        return;
      }

      if (method === "PUT") {
        if (jobIndex === -1) {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Job not found" }));
          return;
        }

        const body = await parseRequestBody(request);
        const updatedJob = {
          ...db.jobs[jobIndex],
          ...body,
          id: db.jobs[jobIndex].id, // preserve id
        };

        db.jobs[jobIndex] = updatedJob;
        saveDbData(db);

        response.statusCode = 200;
        response.end(JSON.stringify(updatedJob));
        return;
      }

      if (method === "DELETE") {
        if (jobIndex === -1) {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Job not found" }));
          return;
        }

        const deletedJob = db.jobs.splice(jobIndex, 1)[0];
        saveDbData(db);

        response.statusCode = 200;
        response.end(JSON.stringify(deletedJob));
        return;
      }
    }

    // ==========================================
    // 2. CANDIDATES ENDPOINTS
    // ==========================================
    if (pathname === "/candidates") {
      if (method === "GET") {
        response.end(JSON.stringify(db.candidates));
        return;
      }

      if (method === "POST") {
        const body = await parseRequestBody(request);
        const newCandidate = {
          id: body.id || (db.candidates.length > 0 ? Math.max(...db.candidates.map((c) => Number(c.id) || 0)) + 1 : 1),
          name: body.name || "",
          email: body.email || "",
          phone: body.phone || "",
          experience: Number(body.experience) || 0,
          skills: Array.isArray(body.skills) ? body.skills : [],
          location: body.location || "",
          resume: body.resume || "",
        };

        db.candidates.push(newCandidate);
        saveDbData(db);

        response.statusCode = 201;
        response.end(JSON.stringify(newCandidate));
        return;
      }
    }

    const candidateMatch = pathname.match(/^\/candidates\/(.+)$/);
    if (candidateMatch) {
      const candidateId = decodeURIComponent(candidateMatch[1]);
      const candidateIndex = db.candidates.findIndex(
        (item) => String(item.id) === candidateId
      );

      if (method === "GET") {
        if (candidateIndex !== -1) {
          response.end(JSON.stringify(db.candidates[candidateIndex]));
        } else {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Candidate not found" }));
        }
        return;
      }

      if (method === "PUT") {
        if (candidateIndex === -1) {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Candidate not found" }));
          return;
        }

        const body = await parseRequestBody(request);
        const updatedCandidate = {
          ...db.candidates[candidateIndex],
          ...body,
          id: db.candidates[candidateIndex].id,
        };

        db.candidates[candidateIndex] = updatedCandidate;
        saveDbData(db);

        response.statusCode = 200;
        response.end(JSON.stringify(updatedCandidate));
        return;
      }

      if (method === "DELETE") {
        if (candidateIndex === -1) {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Candidate not found" }));
          return;
        }

        const deleted = db.candidates.splice(candidateIndex, 1)[0];
        saveDbData(db);

        response.statusCode = 200;
        response.end(JSON.stringify(deleted));
        return;
      }
    }

    // ==========================================
    // 3. APPLICATIONS ENDPOINTS
    // ==========================================
    if (pathname === "/applications") {
      if (method === "GET") {
        response.end(JSON.stringify(db.applications));
        return;
      }

      if (method === "POST") {
        const body = await parseRequestBody(request);
        const newApp = {
          id: body.id || `app-${Date.now()}`,
          jobId: body.jobId,
          candidateId: body.candidateId || null,
          candidateName: body.candidateName || "",
          candidateEmail: body.candidateEmail || "",
          jobTitle: body.jobTitle || "",
          company: body.company || "",
          appliedDate: body.appliedDate || new Date().toISOString().split("T")[0],
          status: body.status || "Under Review",
        };

        db.applications.push(newApp);
        saveDbData(db);

        response.statusCode = 201;
        response.end(JSON.stringify(newApp));
        return;
      }
    }

    const applicationMatch = pathname.match(/^\/applications\/(.+)$/);
    if (applicationMatch) {
      const appId = decodeURIComponent(applicationMatch[1]);
      const appIndex = db.applications.findIndex(
        (item) => String(item.id) === appId
      );

      if (method === "GET") {
        if (appIndex !== -1) {
          response.end(JSON.stringify(db.applications[appIndex]));
        } else {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Application not found" }));
        }
        return;
      }

      if (method === "PUT") {
        if (appIndex === -1) {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Application not found" }));
          return;
        }

        const body = await parseRequestBody(request);
        const updatedApp = {
          ...db.applications[appIndex],
          ...body,
          id: db.applications[appIndex].id,
        };

        db.applications[appIndex] = updatedApp;
        saveDbData(db);

        response.statusCode = 200;
        response.end(JSON.stringify(updatedApp));
        return;
      }

      if (method === "DELETE") {
        if (appIndex === -1) {
          response.statusCode = 404;
          response.end(JSON.stringify({ message: "Application not found" }));
          return;
        }

        const deleted = db.applications.splice(appIndex, 1)[0];
        saveDbData(db);

        response.statusCode = 200;
        response.end(JSON.stringify(deleted));
        return;
      }
    }

    // Default 404 response
    response.statusCode = 404;
    response.end(JSON.stringify({ message: "Not found" }));
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Mock jobs and recruitment API listening on http://localhost:${PORT}`);
  });
