import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import '../Style/Header.css';
import '../Style/theme.css';
import logo from '../../assets/Logo.png';

import { useAuth } from '../Context/AuthContext';
import { useTranslation } from "react-i18next";
import { isAdminUser } from '../../config/admin';

export default function Header() {
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">

        <Link to="/" className="logo">
          <img src={logo} alt="ThreatIQ Logo" className="logo-img" />
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>

          <ul className="nav-list">
            <li><NavLink to="/" end>{t("home")}</NavLink></li>
            <li><NavLink to="/about">{t("about_nav")}</NavLink></li>
            <li><NavLink to="/news">{t("news")}</NavLink></li>
            <li><NavLink to="/posts">{t("posts_nav")}</NavLink></li>
            {user && isAdminUser(user) && (
              <li><NavLink to="/admin">{t("admin_panel")}</NavLink></li>
            )}
            <li><NavLink to="/prevention">{t("prevention")}</NavLink></li>
            <li><NavLink to="/attacks">{t("attacks_nav")}</NavLink></li>
            <li><NavLink to="/tools">{t("tools")}</NavLink></li>
          </ul>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/login" className="login-btn">
                  {t("login.title")}
                </Link>
                <Link to="/signup" className="signup-btn">
                  {t("signup.title")}
                </Link>
              </>
            ) : (
              <div className="user-section">
                <span className="user-email">{user.email}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={16} style={{ marginInlineEnd: '6px' }} />
                  {t("logout")}
                </button>
              </div>
            )}
          </div>

          <div className="lang-switcher">
            <button onClick={() => changeLanguage("en")} className={i18n.language === "en" ? "active" : ""}>
              EN
            </button>
            <button onClick={() => changeLanguage("ar")} className={i18n.language === "ar" ? "active" : ""}>
              AR
            </button>
          </div>

          <button className="btn-theme" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? t("dark_mode") : t("light_mode")}
          </button>

        </nav>
      </div>
    </header>
  );
}