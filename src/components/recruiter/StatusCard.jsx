
import "./StatusCard.css";

function StatusCard({ title, count, icon }) {
  return (
    <div className="status-card">
      <div className="status-card-info">
        <p className="status-card-title">{title}</p>
        <h2 className="status-card-count">{count}</h2>
      </div>

      <div className="status-card-icon">
        {icon}
      </div>
    </div>
  );
}

export default StatusCard;
