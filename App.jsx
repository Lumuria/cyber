import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './App.css';

import Header from './components/Sections/Header';
import Footer from './components/Sections/Footer';

import HomePage from './components/Sections/HomePage';
import AttacksPage from './components/Sections/AttacksPage';
import PreventionPage from './components/Sections/PreventionPage';
import ToolsPage from './components/Sections/ToolsPage';
import NewsPage from './components/Sections/NewsPage';
import PostsPage from './components/Sections/PostsPage';
import AboutPage from './components/Sections/AboutPage';

import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';

import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import ManageNews from './components/Admin/pages/ManageNews';
import ManagePosts from './components/Admin/pages/ManagePosts';
import ManageUsers from './components/Admin/pages/ManageUsers';
import ManageContent from './components/Admin/pages/ManageContent';
import AdminRoute from './components/Admin/AdminRoute';
import IncidentsPage from './components/Sections/IncidentsPage';
import AwarenessPage from './components/Sections/AwarenessPage';

import { AuthProvider } from './components/Context/AuthContext';
import { PostsProvider } from './components/Context/PostsContext';
import { ContentProvider } from './components/Context/ContentContext';

const setMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};

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
      title: `Incidents | ThreatIQ`,
      description: 'Real-world cyber incidents and lessons learned.',
    };
  }

  if (pathname === '/awareness') {
    return {
      title: `Awareness | ThreatIQ`,
      description: 'Awareness tracks and practical cybersecurity learning paths.',
    };
  }

  if (pathname === '/login') {
    return {
      title: `${t('login.title')} | ThreatIQ`,
      description: t('login.subtitle'),
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

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const language = i18n.language === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    const { title, description } = getRouteMetadata(location.pathname, t);
    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
  }, [location.pathname, i18n.language, t]);

  return (
    <AuthProvider>
      <ContentProvider>
        <PostsProvider>
          <div className="App">
            {!isAdmin && <Header />}

            <main>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/attacks" element={<AttacksPage />} />
              <Route path="/prevention" element={<PreventionPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/awareness" element={<AwarenessPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/Signup" element={<Signup />} />

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
            </main>

            {!isAdmin && <Footer />}
          </div>
        </PostsProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
