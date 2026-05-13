import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={navStyle}>
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Dashboard</div>

      <div style={rightSide}>
        <span>{user?.email || 'Admin'}</span>
        <button type="button" style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
        <div style={avatar}>A</div>
      </div>
    </div>
  );
};

const navStyle = {
  background: '#ffffff',
  padding: '15px 25px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #e2e8f0',
};

const rightSide = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const logoutBtn = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '7px 11px',
  cursor: 'pointer',
  fontWeight: 600,
};

const avatar = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  background: '#2563eb',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
};

export default Navbar;
