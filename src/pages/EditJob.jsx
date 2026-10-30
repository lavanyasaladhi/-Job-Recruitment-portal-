import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobForm from "../components/recruiter/JobForm";
import { getJobById, updateJob } from "../services/api";
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

function EditJob() {
  const navigate = useNavigate();
  const { id, jobId } = useParams();
  const currentJobId = id || jobId;

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(currentJobId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(currentJobId ? "" : "Job ID is missing.");

  useEffect(() => {
    if (!currentJobId) return;

    const controller = new AbortController();

    async function loadJob() {
      try {
        setIsLoading(true);
        setError("");

        const job = await getJobById(currentJobId, {
          signal: controller.signal,
        });

        setInitialData({
          ...job,
          id: job.id,
          jobType: job.jobType || job.type || "Full-time",
          minExperience: job.minExperience ?? job.experience ?? 0,
          maxExperience: job.maxExperience ?? job.experience ?? 0,
          minSalary: job.minSalary ?? "",
          maxSalary: job.maxSalary ?? "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : job.skills || "",
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load job details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadJob();
    return () => controller.abort();
  }, [currentJobId]);

  const handleUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");

      const skills = Array.isArray(formData.skills)
        ? formData.skills
        : formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

      const payload = {
        ...initialData,
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
        salary: formatSalary(formData.minSalary, formData.maxSalary) || initialData?.salary || "",
        skills,
        description: formData.description.trim(),
      };

      await updateJob(currentJobId, payload);
      navigate("/recruiter-dashboard");
    } catch (err) {
      setError(err.message || "Failed to update job.");
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

        {isLoading ? (
          <p style={{ textAlign: "center", marginTop: "40px", color: "var(--dashboard-muted, #686a60)" }}>
            Loading job details…
          </p>
        ) : initialData ? (
          <JobForm
            key={initialData.id}
            initialData={initialData}
            onSubmit={handleUpdate}
            onCancel={() => navigate("/recruiter-dashboard")}
          />
        ) : null}

        {isSubmitting && (
          <p role="status" style={{ textAlign: "center", marginTop: "16px", color: "var(--dashboard-primary, #636b2f)" }}>
            Saving changes…
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default EditJob;
