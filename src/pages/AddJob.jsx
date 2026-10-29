
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobForm from "../components/recruiter/JobForm";

function AddJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData) => {
    setIsSubmitting(true);

    // Temporary preview: backend/API integration is still pending.
    console.log("Job details:", formData);

    alert("Job form submitted! Check the console for the entered details.");
    setIsSubmitting(false);
  };

  return (
    <main style={styles.page}>
      <button
        type="button"
        onClick={() => navigate("/")}
        style={styles.backButton}
      >
        Back
      </button>

      <header style={styles.header}>
        <p style={styles.eyebrow}></p>
        <h1 style={styles.title}>Post a New Job</h1>
        <p style={styles.description}>
          Fill in the job details below.
        </p>
      </header>

      <JobForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px 60px",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },
  backButton: {
    border: "none",
    background: "transparent",
    color: "#315bea",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "24px",
  },
  header: {
    maxWidth: "850px",
    margin: "0 auto 28px",
  },
  eyebrow: {
    color: "#315bea",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  title: {
    fontSize: "32px",
    margin: "10px 0",
  },
  description: {
    color: "#6b7280",
    lineHeight: 1.6,
  },
};

export default AddJob;
