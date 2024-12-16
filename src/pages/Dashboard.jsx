import React from 'react';
import Navbar from '@/LandingPage/Navbar';
import DashboardBody from '@/Dashboard/DashboardBody';
import Footer from '@/LandingPage/Footer';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      <DashboardBody />
    </div>
  );
};

export default Dashboard;
