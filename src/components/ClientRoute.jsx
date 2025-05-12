import { Navigate } from "react-router-dom";

export default function ClientRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "client") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
