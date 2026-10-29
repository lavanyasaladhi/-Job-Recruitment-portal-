
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobForm from "../components/recruiter/JobForm";
import { createJob } from "../services/api";
import "./RecruiterDashboard.css";

function AddJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const skills = Array.isArray(formData.skills)
        ? formData.skills
        : formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

      const jobPayload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        type: formData.jobType,
        jobType: formData.jobType,
        minExperience: Number(formData.minExperience) || 0,
        maxExperience: Number(formData.maxExperience) || 0,
        minSalary: Number(formData.minSalary) || 0,
        maxSalary: Number(formData.maxSalary) || 0,
        experience: Number(formData.minExperience) || 0,
        salary: formData.minSalary || "",
        skills,
        description: formData.description.trim(),
        postedDate: new Date().toISOString().split("T")[0],
      };

      await createJob(jobPayload);
      navigate("/manage-jobs");
    } catch (err) {
      setError(err.message || "Unable to post the job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "32px 20px 60px" }}>
      <button type="button" onClick={() => navigate("/recruiter-dashboard")}>
        ← Back to Dashboard
      </button>

      <header style={{ maxWidth: 850, margin: "24px auto" }}>
        <h1>Post a New Job</h1>
        <p>Fill in the job details below.</p>
      </header>

      {error && <p role="alert">{error}</p>}

      <JobForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/recruiter-dashboard")}
      />

      {isSubmitting && <p role="status">Publishing job…</p>}
    </main>
  );
}

export default AddJob;
