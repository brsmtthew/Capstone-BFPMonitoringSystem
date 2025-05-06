import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const AuthContext = createContext({
  token: null,
  login: async () => {},
  logout: async () => {},
  user: null,
  userData: null,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // 1) Listen for auth changes & load userData
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  // 2) Login
  const login = async (firebaseUser) => {
    const newToken = await firebaseUser.getIdToken();
    const expirationTime = Date.now() + 8 * 60 * 60 * 1000; // 8h
    localStorage.setItem('token', newToken);
    localStorage.setItem('expiry', expirationTime.toString());

    setToken(newToken);
    navigate('/dashboard');
  };

  const isLoggingOut = useRef(false); // Flag to prevent multiple logouts
  // 3) Logout
  const logout = async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    setToken(null);
    toast.success('Logout successful!', {
      position: 'top-right',})
    navigate('/');
  };

  // 4) Token-expiry + inactivity timer
  useEffect(() => {
    const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2h
    let inactivityTimer;

    // Reset inactivity timer
    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logout, INACTIVITY_LIMIT);
    };

    // Watch user events
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];
    events.forEach((e) => window.addEventListener(e, resetInactivity));

    // Token expiration
    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem('expiry');
      if (expiry && Date.now() > Number(expiry)) logout();
    };
    const intervalId = setInterval(checkTokenExpiry, 1000);

    // Auth‐state listener for refreshing token
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const refreshed = await firebaseUser.getIdToken(true);
        const newExpiry = Date.now() + 8 * 60 * 60 * 1000;
        localStorage.setItem('token', refreshed);
        localStorage.setItem('expiry', newExpiry.toString());
        setToken(refreshed);
        resetInactivity();
      } else {
        const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
        if (!publicPaths.includes(window.location.pathname)) {
          await logout();
        }
      }
    });

    // Kickstart
    resetInactivity();
    checkTokenExpiry();

    return () => {
      unsubscribe();
      clearInterval(intervalId);
      clearTimeout(inactivityTimer);
      events.forEach((e) => window.removeEventListener(e, resetInactivity));
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, login, logout, user, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
