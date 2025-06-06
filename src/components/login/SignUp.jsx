import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/Firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import signupImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/smarthardhatAsset 1.svg';

// SHA-256 hash of valid admin key
const ADMIN_KEY_HASH =
  'f4daddba374588316fda85f51c243ca40d4f8aa3b70bbeb37504fad680bf39e3';

// Utility: Hash text with SHA-256
const hashText = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.trim());
  const buffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Write user profile document to Firestore
const writeUserProfile = async ({ uid, email, hashedPassword, contact, blocked }) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    email,
    role: 'user',
    password: hashedPassword,
    contact,
    isBlock: blocked,
    createdAt: new Date(),
    lastLogin: new Date(),
  });
};

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', contact: '', adminKey: '' });
  const [show, setShow] = useState({ password: false, adminKey: false });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Toggle visibility for password or admin key
  const toggleVisibility = useCallback((field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  // Validate inputs
  const isFormValid = () => Object.values(form).every((val) => val.trim());

  // Main submit handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fill in all fields.', { position: 'top-right' });
      return;
    }

    setLoading(true);
    try {
      const hashedKey = await hashText(form.adminKey);
      if (hashedKey !== ADMIN_KEY_HASH) {
        toast.error('Invalid admin key.', { position: 'top-right' });
        return;
      }

      // Create or recover account
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const hashedPassword = await hashText(form.password);
      await writeUserProfile({
        uid: user.uid,
        email: form.email,
        hashedPassword,
        contact: form.contact,
        blocked: false,
      });

      toast.success('Sign up successful!', { position: 'top-right' });
      navigate('/', { replace: true });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          const { user } = await signInWithEmailAndPassword(auth, form.email, form.password);
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists()) {
            const hashedPassword = await hashText(form.password);
            await writeUserProfile({
              uid: user.uid,
              email: form.email,
              hashedPassword,
              contact: form.contact,
              blocked: true,
            });
            toast.success('Account recovered (blocked)!', { position: 'top-right' });
          } else {
            toast.info('Account exists. Please log in.', { position: 'top-right' });
          }

          navigate('/', { replace: true });
        } catch (signinErr) {
          const msgMap = {
            'auth/invalid-credential': 'Invalid credentials. Please try again.',
            'auth/user-not-found': 'User not found. Please sign up.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
          };
          toast.error(msgMap[signinErr.code] || 'An error occurred. Please try again.', {
            position: 'top-right',
          });
        }
      } else {
        console.error(error);
        toast.error('Failed to sign up. Please try again.', { position: 'top-right' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bfpNavy flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        {/* Image */}
        <div className="hidden md:block md:w-1/2">
          <img src={signupImage} alt="Signup Visual" className="object-cover h-full w-full" />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <header className="flex items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-bold text-bfpNavy">
              <span className="text-bfpOrange">BFP</span> SmartTrack
            </h1>
          </header>

          <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Create an Account</h2>
          <p className="text-center mb-8 text-gray-600">Sign up to get started with BFP SmartTrack.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            {['email', 'password', 'adminKey', 'contact'].map((field) => {
              const isPasswordField = field === 'password' || field === 'adminKey';
              return (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <div className={isPasswordField ? 'relative' : ''}>
                    <input
                      id={field}
                      name={field}
                      type={
                        isPasswordField
                          ? show[field]
                            ? 'text'
                            : 'password'
                          : field === 'email'
                          ? 'email'
                          : 'text'
                      }
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={
                        field === 'contact'
                          ? 'Enter contact number'
                          : field === 'email'
                          ? 'you@example.com'
                          : `Enter ${field}`
                      }
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
                    />
                    {isPasswordField && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                      >
                        {show[field] ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-bfpNavy text-white font-semibold rounded-md hover:bg-opacity-90 transition"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/')}
                className="text-bfpOrange cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
