import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import loginImage from './LoginAssets/firefighter2.jpg';
import logo from './LoginAssets/labour.png';

function Login() {
  const navigate = useNavigate(); // Create navigate function

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent the default form submission
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="bg-white border border-separatorLine shadow-lg rounded-lg overflow-hidden flex max-w-4xl h-[90vh]">
        <div className="w-full md:w-1/2 p-2 flex flex-col justify-start">
          <div className="flex items-center mb-8 ml-4">
            <img src={logo} alt="logo Icon" className="h-12 w-12 mr-2" />
            <p className="text-lg font-semibold">Smart Hard Hat .Co</p>
          </div>
          
          <p className="text-[32px] text-center font-bold mt-12">WELCOME BACK</p>
          <p className='text[12px] text-center '>Login in to the security access your account and manage your settings</p>
          
          <div className="flex flex-col justify-center">
            <form className="space-y-4 mt-8" onSubmit={handleLogin}> {/* Add onSubmit handler */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full mt-1 px-2 py-1 border border-r-separatorLine rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full mt-1 px-4 py-2 border border-r-separatorLine rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit" // Change type to submit
                className="w-full mt-4 py-2 bg-primeColor text-white font-semibold rounded-full hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Image Column */}
        <div className="hidden md:block md:w-1/2">
          <img src={loginImage} alt="Login Visual" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Login;
