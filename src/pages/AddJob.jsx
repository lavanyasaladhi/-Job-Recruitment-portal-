import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobForm from "../components/recruiter/JobForm";
import { createJob } from "../services/api";
import "./RecruiterDashboard.css";

function formatSalary(min, max) {
  if (!min && !max) return "";
  const numMin = Number(min);
  const numMax = Number(max);
  if (numMin && numMax) {
    if (numMin >= 100000 && numMax >= 100000) {
      const minLpa = (numMin / 100000).toFixed(numMin % 100000 === 0 ? 0 : 1);
      const maxLpa = (numMax / 100000).toFixed(numMax % 100000 === 0 ? 0 : 1);
      return `₹${minLpa} - ${maxLpa} LPA`;
    }
    return `₹${numMin.toLocaleString("en-IN")} - ₹${numMax.toLocaleString("en-IN")}`;
  }
  if (numMin) {
    if (numMin >= 100000) {
      const lpa = (numMin / 100000).toFixed(numMin % 100000 === 0 ? 0 : 1);
      return `₹${lpa} LPA`;
    }
    return `₹${numMin.toLocaleString("en-IN")}`;
  }
  return String(min || max);
}

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
        salary: formatSalary(formData.minSalary, formData.maxSalary),
        skills,
        description: formData.description.trim(),
        postedDate: new Date().toISOString().split("T")[0],
      };

      await createJob(jobPayload);
      navigate("/recruiter-dashboard");
    } catch (err) {
      setError(err.message || "Unable to post the job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main style={{ minHeight: "80vh", padding: "40px 24px 80px", maxWidth: "960px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate("/recruiter-dashboard")}
          className="dashboard-add-button"
          style={{
            background: "transparent",
            color: "var(--dashboard-primary, #636b2f)",
            borderColor: "var(--dashboard-primary, #636b2f)",
            padding: "8px 16px",
            marginBottom: "20px",
          }}
        >
          ← Back to Recruiter Dashboard
        </button>

        {error && <p role="alert">{error}</p>}

        <JobForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/recruiter-dashboard")}
        />

        {isSubmitting && (
          <p role="status" style={{ textAlign: "center", marginTop: "16px", color: "var(--dashboard-primary, #636b2f)" }}>
            Publishing job…
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AddJob;
