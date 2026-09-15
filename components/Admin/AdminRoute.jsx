import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { isAdminUser } from '../../config/admin';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until authentication check is finished
  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: 'var(--text-color)',
        }}
      >
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Authenticated but not admin
  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}