import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/smarthardhatAsset 1.svg';
import ForgotPassword from './ForgotPassword';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added state for show password toggle

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const toggleShow = () => setShowPassword((prev) => !prev); // Toggle function for show password

  const validate = () => form.email.trim() && form.password.trim();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please provide both email and password.', { position: 'top-right' });
      return;
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, form.email, form.password);
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        toast.error('User record missing. Please contact support.', { position: 'top-right' });
        setLoading(false);
        return;
      }

      const data = snap.data();
      if (data.isBlock) {
        toast.error('Your account has been blocked. Please contact the administrator.', { position: 'top-right' });
      } else if (['admin', 'user'].includes(data.role)) {
        await updateDoc(userRef, { lastLogin: new Date() });
        const localName = user.email.split('@')[0];
        const formattedName = localName.charAt(0).toUpperCase() + localName.slice(1);
        toast.success(`Welcome, ${formattedName}!`, { position: 'top-right' });
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('You do not have access.', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Login Error:', err);
      const code = err.code;
      const messages = {
        'auth/wrong-password': 'Invalid email or password. Please check your credentials and try again.',
        'auth/user-not-found': 'Invalid email or password. Please check your credentials and try again.',
        'auth/invalid-credential': 'The provided credentials are not valid. Please try again.',
      };
      toast.error(messages[code] || 'An unexpected error occurred. Please try again.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const navTo = useCallback((path) => navigate(path, { replace: true }), [navigate]);

  return (
    <div className="min-h-screen bg-bfpNavy flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        <div className="hidden md:block md:w-1/2">
          <img src={loginImage} alt="Login Visual" className="object-cover h-full w-full" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <header className="flex items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-bold text-bfpNavy">
              <span className="text-bfpOrange">BFP</span> SmartTrack
            </h1>
          </header>

          <h2 className="text-lg font-semibold text-center mb-4 text-black">User Login</h2>
          <p className="text-center text-sm mb-8 text-black">Securely manage and monitor performance.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-bfpNavy rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'} // Changed type to toggle show/hide password
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1 w-full px-4 py-2 border border-bfpNavy rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
                />
                <button
                  type="button"
                  onClick={toggleShow} // Added toggle button
                  className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-bfpNavy text-white font-semibold rounded-md hover:bg-opacity-90 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => navTo('/forgot-password')} className="hover:underline text-blue">
                Forgot password?
              </button>
              <button type="button" onClick={() => navTo('/signup')} className="hover:underline text-bfpOrange">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
