import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import { auth } from "../../firebase/Firebase"; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import loginImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/smarthardhatAsset 1.svg';
import ForgotPassword from './ForgotPassword';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Client-side validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please provide both email and password.", { position: "top-right" });
      return;
    }
  
    try {
      // Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", { position: "top-right" }); // Show success toast
      navigate('/dashboard', { replace: true }); // Navigate to the dashboard on success
    } catch (err) {
      toast.error("Invalid email or password.", { position: "top-right" }); // Show error toast
    }
  };

  // Redirect the user to the Forgot Password UI
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot Password Clicked');
    navigate('/forgot-password'); // Ensure this route is defined in your routing configuration
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-bfpNavy text-black">
      <ToastContainer /> {/* Required for toast notifications */}
      <div className="bg-white border border-separatorLine shadow-lg rounded-lg overflow-hidden flex max-w-4xl h-[90vh]">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <div className="absolute top-4 left-4 flex items-center mb-8">
            <img src={logo} alt="logo Icon" className="h-12 w-12 mr-2" />
            <p className="font-semibold text-[26px]">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>

          <p className="text-[32px] text-center font-bold mt-20">WELCOME BACK</p>
          <p className='text-[18px] text-center'>Log in to securely access your account and manage your settings</p>

          <div className="flex flex-col justify-center mt-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update state
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update state
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2 bg-blue text-white font-semibold rounded-md hover:bg-hoverBtn transition duration-300"
              >
                Login
              </button>
              {/* Forgot Password Button */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full mt-2 py-2 bg-transparent text-blue font-semibold rounded-md hover:underline transition duration-300"
              >
                Forgot Password?
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img src={loginImage} alt="Login Visual" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Login;