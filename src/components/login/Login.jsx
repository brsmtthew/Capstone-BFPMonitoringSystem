import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import { auth, db } from "../../firebase/Firebase"; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import loginImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/smarthardhatAsset 1.svg';
import ForgotPassword from './ForgotPassword';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';

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
      // Sign in user with Firebase Auth
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
  
      // Get user data from Firestore
      const docRef = doc(db, "users", user.uid); // Correct way to reference a document
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();


        if (userData.isBlock) {
          toast.error("Your account has been blocked. Please contact the administrator.", { position: "top-right" });
          setIsLoading(false);
          return;
        }
        
        if(userData.role === 'admin' || userData.role === 'user') {
          await updateDoc(docRef, { lastLogin: new Date() }); // Update last login timestamp
          toast.success("Login successful!", { position: "top-right" });
          navigate('/dashboard', { replace: true }); // Redirect to Dashboard
        } else {
          toast.error("You do not have access.", { position: "top-right" });
          setIsLoading(false);
        }
      } else {
        toast.error("User data not found. Please contact support.", { position: "top-right" });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      let errorMessage = "An unexpected error occurred. Please try again.";
    
      // Customize error messages based on the error code
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "The provided credentials are not valid. Please try again.";
      }
    
      toast.error(errorMessage, { position: "top-right" });
      setIsLoading(false);
    }    
  };

  // Redirect the user to the Forgot Password UI
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot Password Clicked');
    navigate('/forgot-password'); // Ensure this route is defined in your routing configuration
  };
  
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Sign Up Clicked');
    navigate('/signup'); // Ensure this route is defined in your routing configuration
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bfpNavy">
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
            <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[24px] text-center text-bfpNavy font-bold mb-2">USER LOGIN</h2>
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
              <p className="mt-4 text-center text-md text-black">
                Don't have an account?{' '}
                <span
                  className="text-blue cursor-pointer hover:underline"
                  onClick={handleSignUp}
                >
                  Sign Up
                </span>
              </p>
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