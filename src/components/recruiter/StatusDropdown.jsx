
import "./StatusDropdown.css";

const statuses = [
  "Pending",
  "Shortlisted",
  "Rejected",
  "Selected",
];

function StatusDropdown({
  status = "Pending",
  onChange,
  disabled = false,
}) {
  return (
    <select
      className={`status-dropdown status-${status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
      value={status}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      aria-label="Application status"
    >
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

export default StatusDropdown;
