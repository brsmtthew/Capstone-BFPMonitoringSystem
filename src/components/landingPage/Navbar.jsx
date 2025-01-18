import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import hardhat from "./landingAssets/labour.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false); // Close menu when link is clicked
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white relative">
      {/* Left: Logo and Text */}
      <div className="flex items-center space-x-2">
        <img src={hardhat} alt="Bureau of Fire Protection" className="w-10 h-10 sm:w-14 sm:h-14" />
        <p className="font-semibold font-serif text-lg sm:text-xl md:text-2xl">SMART HARD HAT.CO</p>
      </div>

      {/* Center: Navigation Links (Visible on md and larger) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-4 bg-bfpNavy rounded-full text-white px-6 py-3">
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

      {/* Right: Burger Menu for Small Screens */}
      <div className="lg:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-gray-600">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
            <ul className="flex flex-col space-y-2 p-4">
              {[
                { path: "/dashboard", label: "Dashboard" },
                { path: "/monitoring", label: "Monitoring" },
                { path: "/history", label: "History" },
                { path: "/analytics", label: "Analytics" },
                { path: "/personnel", label: "Personnel" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-2 rounded transition ${
                      activeLink === link.path ? "bg-bfpNavy text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleLinkClick(link.path)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Logout Button inside Burger Menu */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-bfpOrange text-white rounded-lg transition hover:bg-opacity-80"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Right: Logout Button (Visible only on large screens) */}
      <button
        onClick={handleLogout}
        className="hidden lg:block bg-bfpNavy text-white px-4 py-2 rounded-lg transition hover:bg-opacity-80"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
