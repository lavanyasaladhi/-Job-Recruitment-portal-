import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobForm from "../components/recruiter/JobForm";
import { createJob } from "../services/api";
import "./RecruiterDashboard.css";

// Helper function to format salary string (e.g. ₹5 - 10 LPA)
function formatSalary(minSalary, maxSalary) {
  if (!minSalary && !maxSalary) {
    return "";
  }

  const min = Number(minSalary);
  const max = Number(maxSalary);

  // If both min and max are provided
  if (min > 0 && max > 0) {
    if (min >= 100000 && max >= 100000) {
      const minInLakhs = (min / 100000).toFixed(1).replace(".0", "");
      const maxInLakhs = (max / 100000).toFixed(1).replace(".0", "");
      return "₹" + minInLakhs + " - " + maxInLakhs + " LPA";
    }
    return "₹" + min.toLocaleString("en-IN") + " - ₹" + max.toLocaleString("en-IN");
  }

  // If only min is provided
  if (min > 0) {
    if (min >= 100000) {
      const minInLakhs = (min / 100000).toFixed(1).replace(".0", "");
      return "₹" + minInLakhs + " LPA";
    }
    return "₹" + min.toLocaleString("en-IN");
  }

  return String(minSalary || maxSalary);
}

function AddJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Function to navigate back to recruiter dashboard
  function handleBack() {
    navigate("/recruiter-dashboard");
  }

  // Handle form submission to create a new job
  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError("");

    try {
      // Convert skills string into an array of clean skill names
      let skillsList = [];
      if (Array.isArray(formData.skills)) {
        skillsList = formData.skills;
      } else if (typeof formData.skills === "string") {
        const rawSkills = formData.skills.split(",");
        for (let i = 0; i < rawSkills.length; i++) {
          const trimmedSkill = rawSkills[i].trim();
          if (trimmedSkill !== "") {
            skillsList.push(trimmedSkill);
          }
        }
      }

      // Format current date as YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Prepare payload object for API
      const newJob = {
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
        skills: skillsList,
        description: formData.description.trim(),
        postedDate: today,
      };

      await createJob(newJob);
      navigate("/recruiter-dashboard");
    } catch (err) {
      setError(err.message || "Unable to post the job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />

      <main style={{ minHeight: "80vh", padding: "40px 24px 80px", maxWidth: "960px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={handleBack}
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
          onCancel={handleBack}
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
