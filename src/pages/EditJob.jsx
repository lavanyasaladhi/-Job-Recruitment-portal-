
import { useNavigate, useParams } from "react-router-dom";
import JobForm from "../components/recruiter/JobForm";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Temporary demo data until the jobs API is connected.
  const initialData = {
    id,
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    skills: "",
    description: "",
  };

  const handleUpdate = (formData) => {
    console.log("Job ID:", id);
    console.log("Updated job details:", formData);

    alert("Form submitted! API integration is still pending.");
  };

  return (
    <main className="edit-job-page">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="edit-job-back"
      >
        Back
      </button>

      <header className="edit-job-header">
         
        <h1>Edit Job</h1>
         
      </header>

      <JobForm
        initialData={initialData}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/")}
      />
    </main>
  );
}

export default EditJob;
