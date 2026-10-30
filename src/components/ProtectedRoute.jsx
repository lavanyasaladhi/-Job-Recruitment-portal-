import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const redirectParam = encodeURIComponent(
      location.pathname + location.search
    );
    return (
      <Navigate
        to={`/login?role=${role || "candidate"}&redirect=${redirectParam}`}
        replace
      />
    );
  }

  // If a specific role is required and user's role does not match
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "recruiter" ? "/recruiter-dashboard" : "/jobs"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
