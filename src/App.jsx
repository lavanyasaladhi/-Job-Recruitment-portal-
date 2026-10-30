import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import CandidateRegister from "./pages/CandidateRegister";
import MyApplications from "./pages/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ManageJobs from "./pages/ManageJobs";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public and candidate routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CandidateRegister />} />
          <Route
            path="/candidate-register"
            element={<CandidateRegister />}
          />

          {/* Candidate protected routes */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute role="candidate">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Recruiter protected routes */}
          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-jobs"
            element={
              <ProtectedRoute role="recruiter">
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-job"
            element={
              <ProtectedRoute role="recruiter">
                <AddJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute role="recruiter">
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:jobId"
            element={
              <ProtectedRoute role="recruiter">
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute role="recruiter">
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute role="recruiter">
                <Applications />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
