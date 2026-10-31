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
  const currentStatus = status || "Under Review";
  const normalizedClass = `status-${currentStatus.toLowerCase().replace(/\s+/g, "-")}`;
  const options = defaultStatuses.includes(currentStatus)
    ? defaultStatuses
    : [currentStatus, ...defaultStatuses];

  return (
    <select
      className={`status-dropdown ${normalizedClass}`}
      value={currentStatus}
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
