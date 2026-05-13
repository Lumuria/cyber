import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import '../Style/Header.css';

import { useAuth } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';
import { isAdminUser } from '../../config/admin';
import BrandMark from '../BrandMark';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  let savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem('theme');
  } catch {
    savedTheme = null;
  }

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return prefersDark ? 'dark' : 'light';
};

export default function Header() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage errors and continue with in-memory theme state.
    }
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    try {
      window.localStorage.setItem('lang', lng);
    } catch {
      // Ignore storage errors and continue with active language state.
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="ThreatIQ home">
          <BrandMark className="logo-mark" />
          <span className="logo-copy">
            <span className="logo-title">ThreatIQ</span>
            <span className="logo-subtitle">Cyber Awareness Hub</span>
          </span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          id="site-navigation"
          className={`nav-menu ${menuOpen ? 'open' : ''}`}
          aria-label="Main navigation"
        >
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                {t('home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/about">{t('about_nav')}</NavLink>
            </li>
            <li>
              <NavLink to="/news">{t('news')}</NavLink>
            </li>
            <li>
              <NavLink to="/posts">{t('posts_nav')}</NavLink>
            </li>
            {user && isAdminUser(user) && (
              <li>
                <NavLink to="/admin">{t('admin_panel')}</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/prevention">{t('prevention')}</NavLink>
            </li>
            <li>
              <NavLink to="/attacks">{t('attacks_nav')}</NavLink>
            </li>
            <li>
              <NavLink to="/tools">{t('tools')}</NavLink>
            </li>
            <li>
              <NavLink to="/incidents">
                {i18n.language === 'ar' ? 'الحوادث' : 'Incidents'}
              </NavLink>
            </li>
            <li>
              <NavLink to="/awareness">
                {i18n.language === 'ar' ? 'التوعية' : 'Awareness'}
              </NavLink>
            </li>
          </ul>

          <div className="header-controls">
            <div className="auth-buttons">
              {!user ? (
                <>
                  <Link to="/login" className="login-btn">
                    {t('login.title')}
                  </Link>
                  <Link to="/signup" className="signup-btn">
                    {t('signup.title')}
                  </Link>
                </>
              ) : (
                <div className="user-section">
                  <span className="user-email">{user.email}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>

            <div className="lang-switcher" role="group" aria-label="Language selector">
              <button
                onClick={() => changeLanguage('en')}
                className={i18n.language === 'en' ? 'active' : ''}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={i18n.language === 'ar' ? 'active' : ''}
              >
                AR
              </button>
            </div>

            <button className="btn-theme" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'light' ? t('dark_mode') : t('light_mode')}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
