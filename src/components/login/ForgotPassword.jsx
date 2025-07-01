import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth'; // Firebase method for sending reset emails
import { auth } from '../../firebase/Firebase'; // Your configured Firebase auth instance
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  // State to hold the email input
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // This function is triggered when the form is submitted
  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Basic client-side validation: Check if email is entered
    if (!email.trim()) {
      toast.error('Please enter your email.', { position: 'top-right' });
      return;
    }

    try {
      // Firebase call to send the password reset email
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!', { position: 'top-right' });
      
      // Optionally, redirect the user back to the login page after a short delay
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      // Display an error if the email could not be sent
      toast.error('Error sending password reset email.', { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bfpNavy">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue text-white p-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Send Reset Email
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <span
            className="text-blue cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
