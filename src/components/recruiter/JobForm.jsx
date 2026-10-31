
import { useState } from "react";
import "./JobForm.css";

function JobForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    company: initialData.company || "",
    location: initialData.location || "",
    jobType: initialData.jobType || "Full-time",
    minExperience: initialData.minExperience ?? "",
    maxExperience: initialData.maxExperience ?? "",
    minSalary: initialData.minSalary ?? "",
    maxSalary: initialData.maxSalary ?? "",
    skills: Array.isArray(initialData.skills)
      ? initialData.skills.join(", ")
      : initialData.skills || "",
    description: initialData.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      Number(formData.minExperience) >
      Number(formData.maxExperience)
    ) {
      alert("Maximum experience must be greater than minimum experience.");
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <div className="job-form-heading">
        <h2>{initialData.id ? "Edit Job" : "Post a New Job"}</h2>
        <p>Provide the details below to publish your job opening.</p>
      </div>

      <div className="job-form-grid">
        <div className="job-form-field">
          <label htmlFor="title">Job Title *</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            required
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="company">Company Name *</label>
          <input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="location">Location *</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Hyderabad"
            required
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="jobType">Job Type *</label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="job-form-field">
          <label htmlFor="minExperience">Minimum Experience (years) *</label>
          <input
            id="minExperience"
            name="minExperience"
            type="number"
            min="0"
            value={formData.minExperience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="maxExperience">Maximum Experience (years) *</label>
          <input
            id="maxExperience"
            name="maxExperience"
            type="number"
            min="0"
            value={formData.maxExperience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="minSalary">Minimum Salary (₹ per year)</label>
          <input
            id="minSalary"
            name="minSalary"
            type="number"
            min="0"
            value={formData.minSalary}
            onChange={handleChange}
            placeholder="e.g. 300000"
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="maxSalary">Maximum Salary (₹ per year)</label>
          <input
            id="maxSalary"
            name="maxSalary"
            type="number"
            min="0"
            value={formData.maxSalary}
            onChange={handleChange}
            placeholder="e.g. 600000"
          />
        </div>

        <div className="job-form-field full-width">
          <label htmlFor="skills">Required Skills *</label>
          <input
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, JavaScript, CSS"
            required
          />
          <small>Separate skills with commas.</small>
        </div>

        <div className="job-form-field full-width">
          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role and responsibilities..."
            rows="5"
            required
          />
        </div>
      </div>

      <div className="job-form-actions">
        <button
          type="button"
          className="job-form-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit" className="job-form-submit">
          {initialData.id ? "Save Changes" : "Publish Job"}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
