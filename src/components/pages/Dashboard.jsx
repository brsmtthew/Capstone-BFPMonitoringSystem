import React from 'react';
import Navbar from '../landingPage/Navbar'
import DashboardBody from '../pageBody/DashboardBody';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      <DashboardBody />
    </div>
  );
};

export default Dashboard;
