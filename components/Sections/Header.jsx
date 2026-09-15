import { useEffect, useRef, useState } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  User,
  Globe,
  ChevronDown,
  Bell,
  Check,
  CheckCheck,
} from 'lucide-react';
import '../Style/Header.css';
import { useAuth } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';
import { isAdminUser } from '../../config/admin';
import BrandMark from '../BrandMark';
import { API_URL } from '../../services/apiConfig';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    try {
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let isMounted = true;

    const fetchNotifications = async () => {
      const token =
        localStorage.getItem('auth_token');

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/notifications`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setNotifications(
          Array.isArray(data.notifications)
            ? data.notifications
            : []
        );

        setUnreadCount(
          Number(data.unread_count) || 0
        );
      } catch (error) {
        console.error(
          'Failed to load notifications:',
          error
        );
      }
    };

    fetchNotifications();

    const interval = window.setInterval(
      fetchNotifications,
      15000
    );

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light'
    );
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    await logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    try {
      window.localStorage.setItem('lang', lng);
    } catch {}
  };

  const markNotificationAsRead = async (
    notification
  ) => {
    if (notification.read_at) {
      navigate('/news');
      setNotificationsOpen(false);
      return;
    }

    const token =
      localStorage.getItem('auth_token');

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notification.id}/read`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read_at: new Date().toISOString(),
              }
            : item
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );

      setNotificationsOpen(false);
      navigate('/news');
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    const token =
      localStorage.getItem('auth_token');

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read_at:
            notification.read_at ||
            new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    }
  };

  const getNotificationTitle = (notification) => {
    const title = notification?.data?.title;

    if (typeof title === 'string') {
      return title;
    }

    if (title && typeof title === 'object') {
      return (
        title[i18n.language] ||
        title.ar ||
        title.en ||
        (i18n.language === 'ar'
          ? 'خبر جديد'
          : 'New News')
      );
    }

    return i18n.language === 'ar'
      ? 'خبر جديد'
      : 'New News';
  };

  const getNotificationMessage = () => {
    return i18n.language === 'ar'
      ? 'تم نشر خبر جديد على ThreatIQ.'
      : 'A new news article has been published on ThreatIQ.';
  };

  const displayUsername =
    user?.username || user?.name || 'User';

  const avatarLetter = displayUsername
    .charAt(0)
    .toUpperCase();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="logo"
          aria-label="ThreatIQ home"
        >
          <BrandMark className="logo-mark" />

          <span className="logo-copy">
            <span className="logo-title">
              ThreatIQ
            </span>

            <span className="logo-subtitle">
              Cyber Awareness Hub
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() =>
            setMenuOpen((open) => !open)
          }
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <nav
          id="site-navigation"
          className={`nav-menu ${
            menuOpen ? 'open' : ''
          }`}
          aria-label="Main navigation"
        >
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                {t('home')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/about">
                {t('about_nav')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/news">
                {t('news')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/posts">
                {t('posts_nav')}
              </NavLink>
            </li>

            {user && isAdminUser(user) && (
              <li>
                <NavLink to="/admin">
                  {t('admin_panel')}
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/prevention">
                {t('prevention')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/attacks">
                {t('attacks_nav')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/tools">
                {t('tools')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/incidents">
                {i18n.language === 'ar'
                  ? 'الحوادث'
                  : 'Incidents'}
              </NavLink>
            </li>

            <li>
              <NavLink to="/awareness">
                {i18n.language === 'ar'
                  ? 'التوعية'
                  : 'Awareness'}
              </NavLink>
            </li>
          </ul>

          <div className="header-controls">
            <div className="auth-buttons">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="login-btn"
                  >
                    {t('login.title')}
                  </Link>

                  <Link
                    to="/signup"
                    className="signup-btn"
                  >
                    {t('signup.title')}
                  </Link>
                </>
              ) : (
                <div className="user-section">
                  <div
                    className="notification-wrapper"
                    ref={notificationRef}
                  >
                    <button
                      type="button"
                      className="notification-button"
                      onClick={() =>
                        setNotificationsOpen(
                          (open) => !open
                        )
                      }
                      aria-label={
                        i18n.language === 'ar'
                          ? 'الإشعارات'
                          : 'Notifications'
                      }
                      aria-expanded={
                        notificationsOpen
                      }
                    >
                      <Bell size={19} />

                      {unreadCount > 0 && (
                        <span className="notification-badge">
                          {unreadCount > 99
                            ? '99+'
                            : unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="notification-dropdown">
                        <div className="notification-header">
                          <div>
                            <h3>
                              {i18n.language === 'ar'
                                ? 'الإشعارات'
                                : 'Notifications'}
                            </h3>

                            {unreadCount > 0 && (
                              <span>
                                {i18n.language === 'ar'
                                  ? `${unreadCount} غير مقروء`
                                  : `${unreadCount} unread`}
                              </span>
                            )}
                          </div>

                          {unreadCount > 0 && (
                            <button
                              type="button"
                              className="mark-all-button"
                              onClick={
                                markAllNotificationsAsRead
                              }
                            >
                              <CheckCheck size={15} />

                              <span>
                                {i18n.language ===
                                'ar'
                                  ? 'قراءة الكل'
                                  : 'Mark all'}
                              </span>
                            </button>
                          )}
                        </div>

                        <div className="notification-list">
                          {notifications.length ===
                          0 ? (
                            <div className="notification-empty">
                              <Bell size={25} />

                              <span>
                                {i18n.language ===
                                'ar'
                                  ? 'لا توجد إشعارات'
                                  : 'No notifications'}
                              </span>
                            </div>
                          ) : (
                            notifications.map(
                              (notification) => (
                                <button
                                  type="button"
                                  key={
                                    notification.id
                                  }
                                  className={`notification-item ${
                                    notification.read_at
                                      ? 'read'
                                      : 'unread'
                                  }`}
                                  onClick={() =>
                                    markNotificationAsRead(
                                      notification
                                    )
                                  }
                                >
                                  <span className="notification-icon">
                                    <Bell size={17} />
                                  </span>

                                  <span className="notification-content">
                                    <strong>
                                      {getNotificationTitle(
                                        notification
                                      )}
                                    </strong>

                                    <span>
                                      {getNotificationMessage()}
                                    </span>

                                    <small>
                                      {notification.created_at
                                        ? new Date(
                                            notification.created_at
                                          ).toLocaleString(
                                            i18n.language ===
                                              'ar'
                                              ? 'ar-SA'
                                              : 'en-US',
                                            {
                                              dateStyle:
                                                'medium',
                                              timeStyle:
                                                'short',
                                            }
                                          )
                                        : ''}
                                    </small>
                                  </span>

                                  {!notification.read_at && (
                                    <span className="notification-unread-dot">
                                      <Check size={12} />
                                    </span>
                                  )}
                                </button>
                              )
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="user-dropdown">
                    <button
                      type="button"
                      className="user-dropdown-button"
                      onClick={() =>
                        setUserMenuOpen(
                          (open) => !open
                        )
                      }
                      aria-expanded={userMenuOpen}
                    >
                      <span className="user-avatar">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={displayUsername}
                            className="user-avatar-image"
                          />
                        ) : (
                          avatarLetter
                        )}
                      </span>

                      <span className="user-name">
                        {displayUsername}
                      </span>

                      <ChevronDown
                        size={16}
                        className={
                          userMenuOpen
                            ? 'chevron-open'
                            : ''
                        }
                      />
                    </button>

                    {userMenuOpen && (
                      <div className="user-dropdown-menu">
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/profile');
                          }}
                        >
                          <User size={16} />

                          <span>
                            {i18n.language === 'ar'
                              ? 'الملف الشخصي'
                              : 'Profile'}
                          </span>
                        </button>

                        <div className="dropdown-divider" />

                        <div className="dropdown-section">
                          <div className="dropdown-section-title">
                            <Globe size={15} />

                            <span>
                              {i18n.language === 'ar'
                                ? 'اللغة'
                                : 'Language'}
                            </span>
                          </div>

                          <div className="language-options">
                            <button
                              type="button"
                              className={`language-option ${
                                i18n.language === 'en'
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() =>
                                changeLanguage('en')
                              }
                            >
                              English
                            </button>

                            <button
                              type="button"
                              className={`language-option ${
                                i18n.language === 'ar'
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() =>
                                changeLanguage('ar')
                              }
                            >
                              العربية
                            </button>
                          </div>
                        </div>

                        <div className="dropdown-divider" />

                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={toggleTheme}
                        >
                          {theme === 'light' ? (
                            <Moon size={16} />
                          ) : (
                            <Sun size={16} />
                          )}

                          <span>
                            {theme === 'light'
                              ? t('dark_mode')
                              : t('light_mode')}
                          </span>
                        </button>

                        <div className="dropdown-divider" />

                        <button
                          type="button"
                          className="dropdown-item logout-item"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />

                          <span>
                            {t('logout')}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!user && (
              <div
                className="lang-switcher"
                role="group"
                aria-label="Language selector"
              >
                <button
                  type="button"
                  onClick={() =>
                    changeLanguage('en')
                  }
                  className={
                    i18n.language === 'en'
                      ? 'active'
                      : ''
                  }
                >
                  EN
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage('ar')
                  }
                  className={
                    i18n.language === 'ar'
                      ? 'active'
                      : ''
                  }
                >
                  AR
                </button>
              </div>
            )}

            {!user && (
              <button
                type="button"
                className="btn-theme"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <Moon size={18} />
                ) : (
                  <Sun size={18} />
                )}

                <span>
                  {theme === 'light'
                    ? t('dark_mode')
                    : t('light_mode')}
                </span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}