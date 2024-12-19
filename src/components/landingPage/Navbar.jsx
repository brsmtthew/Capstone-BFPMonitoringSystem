import React, { useState } from "react";
import hardhat from "./landingAssets/labour.png";
import profileIcon from "./landingAssets/user (1).png";
import { FaTachometerAlt, FaEye, FaHistory, FaChartBar, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white relative">
      {/* Left: Logo and Text */}
      <div className="flex items-center space-x-2">
        <img src={hardhat} alt="Bureau of Fire Protection" className="w-10 h-10 sm:w-14 sm:h-14" />
        <p className="font-semibold font-serif sm:text-[6px] md:text-[14px] lg:text-[24px]">SMART HARD HAT.CO</p>
      </div>

      {/* Center: Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="hidden sm:flex space-x-4 md:space-x-6 lg:space-x-8 bg-bfpNavy rounded-full text-white px-6 py-3">
          <Link
            to="/dashboard"
            className="text-sm md:text-base lg:text-lg hover:text-gray-300"
          >
            Dashboard
          </Link>
          <Link
            to="/monitoring"
            className="text-sm md:text-base lg:text-lg hover:text-gray"
          >
            Monitoring
          </Link>
          <Link
            to="/history"
            className="text-sm md:text-base lg:text-lg hover:text-gray"
          >
            History
          </Link>
          <Link
            to="/analytics"
            className="text-sm md:text-base lg:text-lg hover:text-gray"
          >
            Analytics
          </Link>
          <Link
            to="/personnel"
            className="text-sm md:text-base lg:text-lg hover:text-gray"
          >
            Personnel
          </Link>
        </div>

        {/* Icons for Small Screens */}
        <div className="flex space-x-4 sm:hidden text-xl text-gray">
          <FaTachometerAlt
            className="cursor-pointer hover:text-gray"
            title="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
          <FaEye
            className="cursor-pointer hover:text-gray"
            title="Monitoring"
            onClick={() => navigate("/monitoring")}
          />
          <FaHistory
            className="cursor-pointer hover:text-gray"
            title="History"
            onClick={() => navigate("/history")}
          />
          <FaChartBar
            className="cursor-pointer hover:text-gray"
            title="Analytics"
            onClick={() => navigate("/analytics")}
          />
          <FaUsers
            className="cursor-pointer hover:text-gray"
            title="Personnel"
            onClick={() => navigate("/personnel")}
          />
        </div>
      </div>

      {/* Right: Profile Image with Dropdown */}
      <div className="relative">
        <img
          src={profileIcon}
          alt="Profile"
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full cursor-pointer"
          onClick={toggleDropdown}
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
