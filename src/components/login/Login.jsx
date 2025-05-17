import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
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
          setTimeout(() => {
            navigate('/dashboard', {replace: true});
          }, 1000); // 500ms delay
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
    navigate('/signup'); // Ensure this route is defined in your routing configuration
  };

  return (
    <div className="min-h-screen bg-bfpNavy flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2">
          <img src={loginImage} alt="Login Visual" className="object-cover h-full" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-bold text-bfpNavy">
              <span className="text-bfpOrange">BFP</span> SmartTrack
            </h1>
          </div>
          <h2 className="text-lg font-semibold text-black text-center mb-4">User Login</h2>
          <p className="text-center text-sm text-black mb-8">Securely manage and monitor performance.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-bfpNavy rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-bfpNavy rounded-md focus:outline-none focus:ring-2 focus:ring-bfpOrange"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-bfpNavy text-white font-semibold rounded-md hover:bg-hoverBtn transition"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-blue hover:underline">Forgot password?</button>
              <button type="button" onClick={() => navigate('/signup')} className="text-bfpOrange hover:underline">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;