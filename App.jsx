import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

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
import AdminRoute from './components/Admin/AdminRoute';

import { AuthProvider } from './components/Context/AuthContext';
import { PostsProvider } from './components/Context/PostsContext';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const { i18n } = useTranslation();

  // 🔥 تغيير الاتجاه تلقائي
  useEffect(() => {
    document.documentElement.dir =
      i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <AuthProvider>
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
              <Route path="/login" element={<Login />} />
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

            </Routes>
          </main>

          {!isAdmin && <Footer />}

        </div>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;
