import React, { useState } from "react";
import hardhat from "./landingAssets/labour.png";
import profileIcon from "./landingAssets/user (1).png";
import { FaTachometerAlt, FaEye, FaHistory, FaChartBar, FaUsers } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To track the current route
  const [activeLink, setActiveLink] = useState(location.pathname); // Initialize with current path

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleLinkClick = (path) => {
    setActiveLink(path); // Update active link state
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white relative">
      {/* Left: Logo and Text */}
      <div className="flex items-center space-x-2">
        <img src={hardhat} alt="Bureau of Fire Protection" className="w-10 h-10 sm:w-14 sm:h-14" />
        <p className="font-semibold font-serif sm:text-32px md:text:text-52 lg:text-64px">SMART HARD HAT.CO</p>
      </div>

      {/* Center: Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="hidden sm:flex space-x-4 md:space-x-6 lg:space-x-8 bg-bfpNavy rounded-full text-white px-6 py-3">
          {[
            { path: "/dashboard", label: "Dashboard" },
            { path: "/monitoring", label: "Monitoring" },
            { path: "/history", label: "History" },
            { path: "/analytics", label: "Analytics" },
            { path: "/personnel", label: "Personnel" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm md:text-base lg:text-lg px-4 py-2 relative transition transform duration-300 ${
                activeLink === link.path
                  ? "text-white font-bold after:block after:bg-bfpOrange after:h-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:rounded-full"
                  : "hover:text-gray-300 hover:scale-105"
              }`}
              onClick={() => handleLinkClick(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons for Small Screens */}
        <div className="flex space-x-4 sm:hidden text-xl text-gray">
          <FaTachometerAlt
            className={`cursor-pointer transition transform duration-300 ${
              activeLink === "/dashboard" ? "text-bfpOrange" : "hover:text-gray hover:scale-110"
            }`}
            title="Dashboard"
            onClick={() => {
              setActiveLink("/dashboard");
              navigate("/dashboard");
            }}
          />
          <FaEye
            className={`cursor-pointer transition transform duration-300 ${
              activeLink === "/monitoring" ? "text-bfpOrange" : "hover:text-gray hover:scale-110"
            }`}
            title="Monitoring"
            onClick={() => {
              setActiveLink("/monitoring");
              navigate("/monitoring");
            }}
          />
          <FaHistory
            className={`cursor-pointer transition transform duration-300 ${
              activeLink === "/history" ? "text-bfpOrange" : "hover:text-gray hover:scale-110"
            }`}
            title="History"
            onClick={() => {
              setActiveLink("/history");
              navigate("/history");
            }}
          />
          <FaChartBar
            className={`cursor-pointer transition transform duration-300 ${
              activeLink === "/analytics" ? "text-bfpOrange" : "hover:text-gray hover:scale-110"
            }`}
            title="Analytics"
            onClick={() => {
              setActiveLink("/analytics");
              navigate("/analytics");
            }}
          />
          <FaUsers
            className={`cursor-pointer transition transform duration-300 ${
              activeLink === "/personnel" ? "text-bfpOrange" : "hover:text-gray hover:scale-110"
            }`}
            title="Personnel"
            onClick={() => {
              setActiveLink("/personnel");
              navigate("/personnel");
            }}
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
