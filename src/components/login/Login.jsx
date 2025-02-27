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
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Client-side validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please provide both email and password.", { position: "top-right" });
      return;
    }

    setIsLoading(true); // Show loading spinner

    try {
      // Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", { position: "top-right" }); // Show success toast
      navigate('/dashboard', { replace: true }); // Navigate to the dashboard on success
    } catch (err) {
      toast.error("Invalid email or password.", { position: "top-right" }); // Show error toast
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  // Redirect the user to the Forgot Password UI
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot Password Clicked');
    navigate('/forgot-password'); // Ensure this route is defined in your routing configuration
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-bfpNavy">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <div className="absolute top-4 left-4 flex items-center">
            <img src={logo} alt="logo" className="h-12 w-12 mr-2" />
            <p className="font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[24px]">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>
          <div className="mt-20">
            <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[24px] text-center text-bfpNavy font-bold mb-2">ADMINISTRATOR ACCESS</h2>
            <p className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] text-bfpNavy mb-6">
              Sign in to securely manage and monitor real-time system performance.
            </p>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue text-white font-semibold rounded-md hover:bg-hoverBtn transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full py-2 text-blue font-semibold rounded-md hover:underline transition duration-300"
              >
                Forgot Password?
              </button>
            </form>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2">
          <img
            src={loginImage}
            alt="Login Visual"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;