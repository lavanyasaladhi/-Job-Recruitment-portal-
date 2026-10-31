# 🌿 CareerConnect — L&T Job Recruitment Portal

<p align="center">
  <img src="public/logo.png" alt="CareerConnect Logo" width="90" style="border-radius: 16px;" />
</p>

<p align="center">
  A modern, responsive, role-based job recruitment web platform built with <b>React 19</b>, <b>Vite</b>, <b>React Router v7</b>, and <b>JSON Server</b>. Designed to seamlessly connect job seekers (Candidates) with hiring teams (Recruiters).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-v7.18-CA4245?logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/JSON_Server-Mock_REST_API-009688" alt="JSON Server" />
  <img src="https://img.shields.io/badge/Linter-Oxlint-4B32C3" alt="Oxlint" />
  <img src="https://img.shields.io/badge/Styling-Vanilla_CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
</p>

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
  - [For Candidates](#1-candidate-features)
  - [For Recruiters](#2-recruiter-features)
  - [General & Architectural Features](#3-general--architectural-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Local Installation & Setup](#-local-installation--setup)
- [Demo Credentials](#-demo-credentials)
- [Available Scripts](#-available-scripts)
- [API Endpoints (JSON Server)](#-api-endpoints-json-server)
- [Design System](#-design-system)

---

## 🌟 Project Overview

**CareerConnect** is designed to provide an end-to-end recruitment experience. The application features strict **Role-Based Access Control (RBAC)**, allowing users to interact with the platform either as a **Candidate** seeking employment or a **Recruiter** managing postings and candidates.

All data operations (creating jobs, filtering listings, registering users, submitting applications, and changing hiring statuses) are powered by a centralized REST API service communicating with **JSON Server** (`db.json`).

---

## 🚀 Key Features

### 1. Candidate Features
- 🔍 **Interactive Job Search & Filtering**: Real-time filtering by keyword/title, location, minimum experience, and job type (Full-time, Contract, Remote, Part-time).
- 🗂️ **Responsive 3-Column Job Grid**: Clean, elegant job cards showcasing key metadata (company, experience, location, job tags).
- 📋 **Comprehensive Job Details View**: View in-depth responsibilities, requirements, tech skills, and compensation formatted in LPA (Lakhs Per Annum).
- 📝 **One-Click Application Flow**: Apply directly through an integrated application form with candidate notes.
- 🛡️ **Duplicate Application Prevention**: Intelligently disables the application form and displays status if the candidate has already applied to that job.
- 📊 **My Applications Hub**: Dedicated portal where candidates can track all their submitted applications and view live status updates from recruiters (*Under Review*, *Shortlisted*, *Accepted*, *Rejected*).

### 2. Recruiter Features
- 📈 **Recruiter Dashboard**: Live command center with key performance indicator (KPI) metric cards:
  - Total Jobs Posted
  - Total Applications Received
  - Active Listings Count
  - Recent candidate applications stream
- 🛠️ **Manage Job Postings**: Centralized table view with real-time search to inspect, edit, or delete published jobs.
- ➕ **Add & Edit Job Postings**: Full-featured form with validation for title, company, location, experience range, salary, skills, and detailed descriptions.
- 👥 **Candidate Review Portal (`/applications`)**:
  - Global view of all applicants or filtered by a specific job ID.
  - Inspect candidate name, email, submission date, and cover notes.
  - Dynamically change candidate hiring status via an interactive status dropdown.
- ⚠️ **Accessible Confirmation Dialog**: Protects against accidental deletion of job postings with a clear confirmation modal.

### 3. General & Architectural Features
- 🔐 **Role-Based Protected Routes**: Unauthorized visits to recruiter routes are blocked and cleanly redirected via `ProtectedRoute.jsx`.
- 🧭 **Dynamic Sticky Navigation Bar**: Automatically adapts links based on whether the logged-in user is a Candidate, Recruiter, or Guest.
- 📱 **Mobile & Desktop Responsive**: Built using custom responsive CSS Grid and Flexbox layouts.
- 🧼 **Clean, Beginner-Friendly Code**: Low-level JavaScript and React patterns using standard hooks (`useState`, `useEffect`), clean array operations, and clear async functions.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19 (`v19.2.8`)** | Modern frontend library with functional components and hooks. |
| **Vite (`v8.3.4`)** | High-performance build tool and fast development server with HMR. |
| **React Router DOM (`v7.18.4`)** | Declarative client-side routing, protected routes, and URL params. |
| **JSON Server (`v1.0.0-beta.15`)** | Lightweight mock REST API server backed by `db.json`. |
| **Native Fetch API** | Asynchronous HTTP requests with `async/await` and error handling. |
| **Context API (`AuthContext`)** | Centralized session state management persisted via `localStorage`. |
| **Lucide React (`v1.61.0`)** | Lightweight, accessible SVG icon library. |
| **Vanilla CSS3** | Custom properties (CSS variables), CSS Grid, Flexbox, glassmorphism. |
| **Oxlint (`v1.81.0`)** | Blazing-fast JavaScript/React linter ensuring 0 errors/warnings. |

---

## 📂 Folder Structure

```text
Job_Recruitment_portal/
├── public/
│   ├── logo.png                     # Circular brand logo icon
│   └── _redirects                   # SPA routing rule for hosting
├── src/
│   ├── assets/                      # Background images and illustrations
│   │   ├── logo.png
│   │   ├── navbar-background.png
│   │   └── botanical-background.png
│   ├── components/                  # Reusable UI components
│   │   ├── Navbar.jsx / .css        # Sticky role-based navigation bar
│   │   ├── Footer.jsx / .css        # Global responsive footer
│   │   ├── JobCard.jsx / .css       # 3-column responsive job card
│   │   ├── ProtectedRoute.jsx       # Route guard for candidate & recruiter roles
│   │   └── recruiter/               # Specialized recruiter modular components
│   │       ├── ApplicantsTable.jsx  # Candidate applications table
│   │       ├── RecruiterJobTable.jsx# Job listings management table
│   │       ├── JobForm.jsx          # Add/Edit job controlled form
│   │       ├── StatusCard.jsx       # Dashboard KPI metric cards
│   │       ├── StatusDropdown.jsx   # Interactive status selector
│   │       └── ConfirmDialog.jsx    # Modal dialog for deletions
│   ├── context/
│   │   ├── AuthContext.jsx          # User authentication and role store
│   │   └── useAuth.js               # Custom hook to consume auth context
│   ├── pages/                       # Route pages
│   │   ├── Home.jsx / .css          # Hero landing page & pathways
│   │   ├── Jobs.jsx / .css          # Job finder with multi-filters
│   │   ├── JobDetails.jsx           # Job details & application submission
│   │   ├── Login.jsx / .css         # Candidate & Recruiter sign-in/register
│   │   ├── CandidateRegister.jsx    # Dedicated candidate sign-up page
│   │   ├── MyApplications.jsx       # Candidate submitted applications hub
│   │   ├── RecruiterDashboard.jsx   # Recruiter KPI dashboard
│   │   ├── ManageJobs.jsx           # Recruiter job list management
│   │   ├── AddJob.jsx               # Recruiter post new job page
│   │   ├── EditJob.jsx              # Recruiter edit job page
│   │   └── Applications.jsx / .css  # Recruiter candidate review page
│   ├── services/
│   │   └── api.js                   # Centralized Fetch API service for JSON Server
│   ├── App.jsx                      # Route configuration & providers
│   ├── main.jsx                     # Application root entry point
│   └── index.css                    # Global CSS variables & base styles
├── db.json                          # JSON Server database (jobs, candidates, applications)
├── package.json                     # Dependencies and scripts
├── vercel.json                      # Vercel deployment rewrites
└── README.md                        # Documentation
```

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version `18.x` or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/)

---

## 💻 Local Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/lavanyasaladhi/-Job-Recruitment-portal-.git
cd -Job-Recruitment-portal-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the JSON Server (Mock Backend)
In your first terminal, run:
```bash
npm run server
```
> The mock REST API will start on: **`http://localhost:3000`**

### 4. Start the Frontend Development Server
In a **second terminal**, run:
```bash
npm run dev
```
> The Vite development server will start on: **`http://localhost:5173`**

### 5. Open in Your Browser
Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 🔑 Demo Credentials

You can either register new accounts through the UI or use the existing preconfigured accounts:

| Role | Email | Password | Access / Scope |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@careerconnect.com` | `recruiter123` | Recruiter Dashboard, Post Jobs, Manage Jobs, Review Applicants |
| **Candidate** | `suren@example.com` | `candidate123` | Search & Filter Jobs, Submit Applications, My Applications |

*(Note: You can also click **Register** on the login page to create any new custom candidate or recruiter account!)*

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite React development server on `http://localhost:5173`. |
| `npm run server` | Starts JSON Server on port `3000` reading and persisting data to `db.json`. |
| `npm run build` | Compiles optimized production bundle into the `dist/` directory. |
| `npm run lint` | Runs `oxlint` to check code quality and ensure zero syntax/runtime warnings. |
| `npm run preview` | Locally serves the compiled production build from `dist/`. |

---

## 🔌 API Endpoints (JSON Server)

The centralized service ([`src/services/api.js`](src/services/api.js)) communicates with the following REST endpoints:

### Jobs Collection (`/jobs`)
- `GET /jobs` – Fetch all job postings.
- `GET /jobs/:id` – Fetch a single job by ID.
- `POST /jobs` – Create a new job posting.
- `PUT /jobs/:id` or `PATCH /jobs/:id` – Update an existing job posting.
- `DELETE /jobs/:id` – Remove a job posting.

### Candidates Collection (`/candidates`)
- `GET /candidates` – Fetch registered candidates.
- `GET /candidates/:id` – Fetch a candidate by ID.
- `POST /candidates` – Register a new candidate.

### Applications Collection (`/applications`)
- `GET /applications` – Fetch all job applications.
- `GET /applications?candidateId=:id` – Fetch applications for a specific candidate.
- `GET /applications?jobId=:id` – Fetch applications for a specific job.
- `POST /applications` – Submit a new candidate application.
- `PATCH /applications/:id` – Update application status (*Under Review*, *Shortlisted*, etc.).

---

## 🎨 Design System & Theme

The UI follows an earthy **Botanical Olive & Cream** design aesthetic:
- **Primary Color:** `#636b2f` (Earthy Olive Green)
- **Primary Hover:** `#4f5625`
- **Deep Text & Headings:** `#203832` (Forest Deep)
- **Muted Text:** `#536863`
- **Surface / Background:** Soft cream with clean borders (`#e3e9d8` / `#ecefe4`)
- **Cards & Navbar:** White cards with subtle drop shadows and backdrop blurs (`backdrop-filter: blur(12px)`).

---

## 👥 Contributors & Acknowledgements
- Developed for the **L&T Job Recruitment Portal** project.
- Built with focus on code readability, accessibility, and clean component architecture.
