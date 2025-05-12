// src/components/TraiteurRoute.jsx
import { Navigate } from "react-router-dom";

export default function TraiteurRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "traiteur") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
