// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from './Login/Login';
import History from '@/pages/History';
import Analytics from './pages/Analytics';
import Personnel from './pages/Personnel';
import Monitoring from './pages/Monitoring';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/personnel" element={<Personnel />} />
      </Routes>
    </div>
  );
}

export default App;
