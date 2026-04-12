import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { isAdminUser } from '../../config/admin';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
