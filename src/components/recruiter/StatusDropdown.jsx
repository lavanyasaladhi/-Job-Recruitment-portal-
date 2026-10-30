import "./StatusDropdown.css";

const defaultStatuses = [
  "Under Review",
  "Shortlisted",
  "Accepted",
  "Rejected",
];

function StatusDropdown({
  status = "Under Review",
  onChange,
  disabled = false,
}) {
  const normalizedClass = `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
  const options = defaultStatuses.includes(status)
    ? defaultStatuses
    : [status, ...defaultStatuses];

  return (
    <select
      className={`status-dropdown ${normalizedClass}`}
      value={status}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      aria-label="Application status"
    >
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

export default StatusDropdown;
