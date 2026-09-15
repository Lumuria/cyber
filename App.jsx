import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './App.css';

// Sections
import Header from './components/Sections/Header';
import Footer from './components/Sections/Footer';

import HomePage from './components/Sections/HomePage';
import AttacksPage from './components/Sections/AttacksPage';
import PreventionPage from './components/Sections/PreventionPage';
import ToolsPage from './components/Sections/ToolsPage';
import NewsPage from './components/Sections/NewsPage';
import PostsPage from './components/Sections/PostsPage';
import AboutPage from './components/Sections/AboutPage';
import IncidentsPage from './components/Sections/IncidentsPage';
import AwarenessPage from './components/Sections/AwarenessPage';

// Pages
import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import Profile from './components/Pages/Profile';
import ForgotPassword from './components/Pages/ForgotPassword';

// Admin
import AdminLayout from './components/Admin/AdminLayout';
import AdminRoute from './components/Admin/AdminRoute';

import Dashboard from './components/Admin/Dashboard';
import ManageNews from './components/Admin/pages/ManageNews';
import ManagePosts from './components/Admin/pages/ManagePosts';
import ManageUsers from './components/Admin/pages/ManageUsers';
import ManageComments from './components/Admin/pages/ManageComments';
import ManageContent from './components/Admin/pages/ManageContent';

// Context
import { AuthProvider } from './components/Context/AuthContext';
import { PostsProvider } from './components/Context/PostsContext';
import { ContentProvider } from './components/Context/ContentContext';


// --------------------------------------------------
// Meta Tags
// --------------------------------------------------

const setMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  );

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};


// --------------------------------------------------
// Route Metadata
// --------------------------------------------------

const getRouteMetadata = (path, t) => {
  const pathname = path.toLowerCase();

  if (pathname === '/about') {
    return {
      title: `${t('about_nav')} | ThreatIQ`,
      description: t('about.subtitle'),
    };
  }

  if (pathname === '/news') {
    return {
      title: `${t('news')} | ThreatIQ`,
      description: t('newsPage.subtitle'),
    };
  }

  if (pathname === '/posts') {
    return {
      title: `${t('posts_nav')} | ThreatIQ`,
      description: t('postsPage.subtitle'),
    };
  }

  if (pathname === '/prevention') {
    return {
      title: `${t('prevention')} | ThreatIQ`,
      description: t('preventionPage.subtitle'),
    };
  }

  if (pathname === '/attacks') {
    return {
      title: `${t('attacks_nav')} | ThreatIQ`,
      description: t('attacks.subtitle'),
    };
  }

  if (pathname === '/tools') {
    return {
      title: `${t('tools')} | ThreatIQ`,
      description: t('toolsPage.subtitle'),
    };
  }

  if (pathname === '/incidents') {
    return {
      title: 'Incidents | ThreatIQ',
      description:
        'Real-world cyber incidents and lessons learned.',
    };
  }

  if (pathname === '/awareness') {
    return {
      title: 'Awareness | ThreatIQ',
      description:
        'Awareness tracks and practical cybersecurity learning paths.',
    };
  }

  if (pathname === '/login') {
    return {
      title: `${t('login.title')} | ThreatIQ`,
      description: t('login.subtitle'),
    };
  }

  if (pathname === '/forgot-password') {
    return {
      title: 'Forgot Password | ThreatIQ',
      description:
        'Reset your ThreatIQ account password securely.',
    };
  }

  if (pathname === '/signup') {
    return {
      title: `${t('signup.title')} | ThreatIQ`,
      description: t('signup.subtitle'),
    };
  }

  return {
    title: 'ThreatIQ | Cyber Awareness Hub',
    description: t('homePage.subtitle'),
  };
};


// --------------------------------------------------
// Routes
// --------------------------------------------------

function AppRoutes() {
  return (
    <Routes>

      {/* Public Pages */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/attacks"
        element={<AttacksPage />}
      />

      <Route
        path="/prevention"
        element={<PreventionPage />}
      />

      <Route
        path="/tools"
        element={<ToolsPage />}
      />

      <Route
        path="/news"
        element={<NewsPage />}
      />

      <Route
        path="/posts"
        element={<PostsPage />}
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/incidents"
        element={<IncidentsPage />}
      />

      <Route
        path="/awareness"
        element={<AwarenessPage />}
      />


      {/* Authentication */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/Signup"
        element={<Signup />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* Admin Dashboard */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />


      {/* Admin - News */}

      <Route
        path="/admin/news"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManageNews />
            </AdminLayout>
          </AdminRoute>
        }
      />


      {/* Admin - Posts */}

      <Route
        path="/admin/posts"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManagePosts />
            </AdminLayout>
          </AdminRoute>
        }
      />


      {/* Admin - Comments */}

      <Route
        path="/admin/comments"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManageComments />
            </AdminLayout>
          </AdminRoute>
        }
      />


      {/* Admin - Users */}

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />


      {/* Admin - Content */}

      <Route
        path="/admin/content"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManageContent />
            </AdminLayout>
          </AdminRoute>
        }
      />

    </Routes>
  );
}


// --------------------------------------------------
// Main App
// --------------------------------------------------

function App() {
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith('/admin');

  const isForgotPassword =
    location.pathname.toLowerCase() ===
    '/forgot-password';

  const { t, i18n } = useTranslation();


  // --------------------------------------------------
  // Language and direction
  // --------------------------------------------------

  useEffect(() => {
    const language =
      i18n.language === 'ar'
        ? 'ar'
        : 'en';

    document.documentElement.lang =
      language;

    document.documentElement.dir =
      language === 'ar'
        ? 'rtl'
        : 'ltr';
  }, [i18n.language]);


  // --------------------------------------------------
  // Page metadata
  // --------------------------------------------------

  useEffect(() => {
    const {
      title,
      description,
    } = getRouteMetadata(
      location.pathname,
      t
    );

    document.title = title;

    setMetaTag(
      'name',
      'description',
      description
    );

    setMetaTag(
      'property',
      'og:title',
      title
    );

    setMetaTag(
      'property',
      'og:description',
      description
    );
  }, [
    location.pathname,
    i18n.language,
    t,
  ]);


  // --------------------------------------------------
  // Normal application
  // --------------------------------------------------

  const appContent = (
    <div className="App">

      {/* Public Header */}
      {!isAdmin && <Header />}

      <main>
        <AppRoutes />
      </main>

      {/* Public Footer */}
      {!isAdmin && <Footer />}

    </div>
  );


  // --------------------------------------------------
  // Forgot Password
  //
  // Do NOT load ContentProvider or PostsProvider.
  // This prevents unnecessary API requests.
  // --------------------------------------------------

  if (isForgotPassword) {
    return (
      <AuthProvider>
        {appContent}
      </AuthProvider>
    );
  }


  // --------------------------------------------------
  // Rest of the application
  // --------------------------------------------------

  return (
    <AuthProvider>
      <ContentProvider>
        <PostsProvider>
          {appContent}
        </PostsProvider>
      </ContentProvider>
    </AuthProvider>
  );
}


export default App;