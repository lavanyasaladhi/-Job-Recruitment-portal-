
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobForm from "../components/recruiter/JobForm";
import { getJobById, updateJob } from "../services/api";

function EditJob() {
  const navigate = useNavigate();
  const { id, jobId } = useParams();
  const currentJobId = id || jobId;

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

    if (currentJobId) {
      loadJob();
    } else {
      setError("Job ID is missing.");
      setIsLoading(false);
    }

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
        salary: formData.minSalary || "",
        skills,
        description: formData.description.trim(),
      };

      await updateJob(currentJobId, payload);
      navigate("/manage-jobs");
    } catch (err) {
      setError(err.message || "Failed to update job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <main className="edit-job-page">Loading job details…</main>;
  }

  if (error && !initialData) {
    return (
      <main className="edit-job-page">
        <p role="alert">{error}</p>
        <button onClick={() => navigate("/recruiter-dashboard")}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="edit-job-page">
      <button
        type="button"
        onClick={() => navigate("/recruiter-dashboard")}
        className="edit-job-back"
      >
        ← Back to Dashboard
      </button>

      <header className="edit-job-header">
        <h1>Edit Job</h1>
      </header>

      {error && <p role="alert">{error}</p>}

      {initialData && (
        <JobForm
          key={initialData.id}
          initialData={initialData}
          onSubmit={handleUpdate}
          onCancel={() => navigate("/recruiter-dashboard")}
        />
      )}

      {isSubmitting && <p role="status">Saving changes…</p>}
    </main>
  );
}

export default EditJob;
