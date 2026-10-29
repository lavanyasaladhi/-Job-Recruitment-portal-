import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

// Main application component with routing and auth state
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Candidate Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CandidateRegister />} />
          <Route path="/candidate-register" element={<CandidateRegister />} />
          <Route path="/my-applications" element={<MyApplications />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/edit-job/:jobId" element={<EditJob />} />
          <Route path="/applications" element={<Applications />} />

          {/* 404 Not Found Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
