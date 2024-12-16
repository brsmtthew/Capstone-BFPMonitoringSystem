import React, { useState } from 'react';
import hardhat from "./landingAssets/labour.png";
import profileIcon from "./landingAssets/user (1).png";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear session
    navigate("/", {replace : true}); // Redirect to login page
  };

  return (
    <nav className="flex items-center justify-between p-4 lg:bg-white relative">
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

      {/* Right: Profile Image with Dropdown */}
      <div className="relative">
        <img 
          src={profileIcon} 
          alt="Profile" 
          className="w-14 h-14 rounded-full cursor-pointer"
          onClick={toggleDropdown} // Toggle dropdown on click
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
            <ul>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
