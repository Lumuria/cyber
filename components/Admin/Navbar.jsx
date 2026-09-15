import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div style={navStyle}>
      <button
        type="button"
        onClick={handleLogoClick}
        style={logoButton}
        aria-label="Go to ThreatIQ website"
      >
        ThreatIQ
      </button>

      <div style={rightSide}>
        <span
          style={{
            color: '#334155',
            fontWeight: 500,
          }}
        >
          {user?.email || t('adminPanel.admin')}
        </span>

        <button
          type="button"
          style={logoutBtn}
          onClick={handleLogout}
        >
          {t('adminPanel.logout')}
        </button>

        <div style={avatar}>
          A
        </div>
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

const logoButton = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#0f172a',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
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