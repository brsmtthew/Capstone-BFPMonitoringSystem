// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Login from './components/login/Login';
import History from './components/pages/History';
import Analytics from './components/pages/Analytics';
import Personnel from './components/pages/Personnel';
import Monitoring from './components/pages/Monitoring';
import Navbar from './components/landingPage/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {AuthProvider} from './components/auth/AuthContext';
import ForgotPassword from './components/login/ForgotPassword';

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monitoring"
          element={
            <ProtectedRoute>
              <Monitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personnel"
          element={
            <ProtectedRoute>
              <Personnel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
