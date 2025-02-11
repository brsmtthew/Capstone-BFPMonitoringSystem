import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/Firebase'; // Import Firebase auth
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Function to handle login and set expiry
  const login = async (user) => {
    const newToken = await user.getIdToken();
    const expirationTime = Date.now() + 4 * 60 * 60 * 1000; // 4 hours from now
    localStorage.setItem('token', newToken);
    localStorage.setItem('expiry', expirationTime);
    setToken(newToken);
    navigate('/dashboard');
  };

  // Function to handle logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    setToken(null);
    navigate('/');
  };

  // Validate token on load and set up auth state listener
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem('expiry');
      if (expiry && Date.now() > Number(expiry)) {
        logout();
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const newToken = await user.getIdToken(true); // Force refresh token
        const expirationTime = Date.now() + 4 * 60 * 60 * 1000; // 4 hours from now
        localStorage.setItem('token', newToken);
        localStorage.setItem('expiry', expirationTime);
        setToken(newToken);
      } else {
        if (window.location.pathname !== '/' && window.location.pathname !== '/forgot-password') {
          logout();
        }
      }
    });

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 1000); // Check every second

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);