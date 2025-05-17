import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import { auth, db } from "../../firebase/Firebase"; 
import { setDoc, doc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import signupImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/smarthardhatAsset 1.svg';

// Precomputed SHA-256 hash of "phbyz7gz"
// const ADMIN_KEY_HASH = "40689b87b2e7ba33f77ed9628d0b0c5809c26873ff41c7a474100981b5073fc1";
const ADMIN_KEY_HASH = "f4daddba374588316fda85f51c243ca40d4f8aa3b70bbeb37504fad680bf39e3"; //BFPTagumCity11

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const hashText = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const checkAdminKey = async (key) => {
    const hashedInput = await hashText(key.trim());
    if (hashedInput !== ADMIN_KEY_HASH) {
      toast.error("Invalid admin key", { position: "top-right" });
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !contact.trim() || !adminKey.trim()) {
      toast.error("Please fill in all required fields.", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      const valid = await checkAdminKey(adminKey);
      if (!valid) return setIsLoading(false);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const hashedPassword = await hashText(password);

      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "user",
        password: hashedPassword,
        contact,
        isBlock: false,
        createdAt: new Date(),
      });

      toast.success("Sign up successful!", { position: "top-right" });
      navigate('/', { replace: true });
    } catch (err) {
      toast.error("Sign up failed. " + err.message, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bfpNavy flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img src={signupImage} alt="Signup Visual" className="object-cover h-full w-full" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-bold text-bfpNavy">
              <span className="text-bfpOrange">BFP</span> SmartTrack
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Create an Account</h2>
          <p className="text-center text-gray-600 mb-8">Sign up to get started with BFP SmartTrack.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
              />
            </div>

            <div>
              <label htmlFor="adminkey" className="block text-sm font-medium text-gray-700">Admin Key</label>
              <div className="relative">
                <input
                  id="adminkey"
                  type={showAdminKey ? "text" : "password"}
                  value={adminKey}
                  onChange={e => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminKey(!showAdminKey)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >{showAdminKey ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="Enter your contact number"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-bfpNavy text-white font-semibold rounded-md hover:bg-opacity-90 transition"
            >{isLoading ? 'Signing up...' : 'Sign Up'}</button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <span className="text-bfpOrange cursor-pointer hover:underline" onClick={() => navigate('/')}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
