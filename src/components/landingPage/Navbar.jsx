import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import logoIcon from "./landingAssets/smarthardhatAsset 1.svg";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useAuth().logout;
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, userData } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false); // Close menu when link is clicked
  };

  // Define common navigation links.
  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/personnel", label: "Personnel" },
    { path: "/monitoring", label: "Monitoring" },
    { path: "/history", label: "History" },
    { path: "/analytics", label: "Analytics" },
  ];

  // Only add the Account link if the user is an admin.
  if (userData && userData.role === "admin") {
    navLinks.push({ path: "/account", label: "Account" });
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-white sticky top-0 z-50">
      {/* Left: Logo and Text */}
      <div className="flex items-center space-x-2">
        <img src={logoIcon} alt="Bureau of Fire Protection" className="w-10 h-10 sm:w-14 sm:h-14" />
        <p className="font-semibold font-serif sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[26px]">
          <span className="text-bfpOrange font-bold">BFP</span>
          <span className="text-bfpNavy">SmartTrack</span>
        </p>
      </div>

      {/* Center: Navigation Links (Visible on xl and larger) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden xl:flex space-x-4 bg-bfpNavy rounded-full text-white px-6 py-3">
        {navLinks.map((link) => (
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

      {/* Right: Mobile Menu */}
      <div className="xl:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-gray-600"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed top-0 right-0 w-1/2 h-full bg-white border-l shadow-lg z-50 flex flex-col justify-between">
            <div className="p-6 flex-grow">
              {/* Mobile user details */}
              <div className="mb-6 pb-4 border-b">
                <p className="text-sm font-bold">{user?.email}</p>
                <p className="text-sm text-gray">{userData?.role}</p>
              </div>
              <ul className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`block text-lg px-4 py-2 rounded transition ${
                        activeLink === link.path
                          ? "bg-bfpOrange text-white"
                          : "hover:bg-gray"
                      }`}
                      onClick={() => handleLinkClick(link.path)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full bg-bfpNavy text-white text-lg rounded-lg py-3 hover:bg-opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Logout and User Icon (Visible on xl screens) */}
      <div className="hidden xl:flex items-center">
        {/* User Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <FaUser className="w-8 h-8 text-bfpNavy" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <div className="px-4 py-2 text-sm text-black">
                <p>{user?.email}</p>
                <p>{userData?.role}</p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-bfpNavy text-white px-6 py-3 rounded-lg transition hover:bg-opacity-80"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
