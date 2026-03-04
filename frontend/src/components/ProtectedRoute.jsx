import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const userRoles = user.roles ? user.roles.map(r => r.name) : (user.role ? [user.role] : []);
    const hasPermission = roles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;