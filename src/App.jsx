
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Applications from "./pages/Applications";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
        <Route path="/applications/:id" element={<Applications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
