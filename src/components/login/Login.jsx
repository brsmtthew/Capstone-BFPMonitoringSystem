import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import { auth } from "../../firebase/Firebase"; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import loginImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/labour.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", { position: "top-right" }); // Show success toast
      navigate('/dashboard', { replace: true }); // Navigate to the dashboard on success
    } catch (err) {
      toast.error("Invalid email or password.", { position: "top-right" }); // Show error toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <ToastContainer /> {/* Required for toast notifications */}
      <div className="bg-white border border-separatorLine shadow-lg rounded-lg overflow-hidden flex max-w-4xl h-[90vh]">
        <div className="w-full md:w-1/2 p-2 flex flex-col justify-start">
          <div className="flex items-center mb-8 ml-4">
            <img src={logo} alt="logo Icon" className="h-12 w-12 mr-2" />
            <p className="text-lg font-semibold">Smart Hard Hat .Co</p>
          </div>

          <p className="text-[32px] text-center font-bold mt-12">WELCOME BACK</p>
          <p className='text-[12px] text-center'>Log in to securely access your account and manage your settings</p>

          <div className="flex flex-col justify-center">
            <form className="space-y-4 mt-8" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update state
                  className="w-full mt-1 px-2 py-1 border border-r-separatorLine rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
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
                  className="w-full mt-1 px-4 py-2 border border-r-separatorLine rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2 bg-primeColor text-white font-semibold rounded-full hover:bg-blue-600"
              >
                Login
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
