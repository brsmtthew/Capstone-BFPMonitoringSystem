import React from 'react';
import hardhat from "./landingAssets/labour.png";
import profileIcon from "./landingAssets/profile1.jpg";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 lg:bg-white shadow-md">
      {/* Left: Logo and Text */}
      <div className="flex items-center space-x-2">
        <img src={hardhat} alt="Bureau of Fire Protection" className="w-14 h-14" />
        <p className="font-semibold font-serif text-[18px]">SMART HARD HAT.CO</p>
      </div>

      {/* Center: Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="bg-primeColor rounded-full text-white border px-12 py-4 text-[20px]">
          <div className="flex space-x-20">
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/monitoring" className="hover:text-gray-300">Monitoring</Link>
            <Link to="/history" className="hover:text-gray-300">History</Link> 
            <Link to="/analytics" className="hover:text-gray-300">Analytics</Link> 
            <Link to="/personnel" className="hover:text-gray-300">Personnel</Link>
          </div>
        </div>
      </div>

      {/* Right: Profile Image */}
      <div className="flex items-center space-x-2">
        <img 
          src={profileIcon} 
          alt="Profile" 
          className="w-20 h-20 rounded-full border-2 border-gray-500"
        />
      </div>
    </nav>
  );
};

export default Navbar;
