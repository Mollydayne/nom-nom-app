import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    localStorage.setItem('redirectReason', 'unauthorized');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
