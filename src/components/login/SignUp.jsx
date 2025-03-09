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
const ADMIN_KEY_HASH = "40689b87b2e7ba33f77ed9628d0b0c5809c26873ff41c7a474100981b5073fc1";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  // Hash a string using SHA-256 and return the hex digest
  const hashText = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Validate the admin key by comparing its hash with the stored hash
  const checkAdminKey = async (key) => {
    const trimmedKey = key.trim();
    const hashedInput = await hashText(trimmedKey);
    console.log("Entered admin key:", trimmedKey);
    console.log("Computed hash:", hashedInput);
    console.log("Expected hash:", ADMIN_KEY_HASH);
    
    if (hashedInput !== ADMIN_KEY_HASH) {
      toast.error("Invalid admin key", { position: "top-right" });
      return false;
    }
    return true;
  };


  const handleSignUp = async (e) => {
    e.preventDefault();
    // Require adminKey for all roles
    if (!email.trim() || !password.trim() || !contact.trim() || !adminKey.trim()) {
      toast.error("Please fill in all required fields.", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      // Validate the admin key for all roles
      const isValidAdminKey = await checkAdminKey(adminKey);
      if (!isValidAdminKey) {
        setIsLoading(false);
        return;
      }

      // Create the user using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Hash the password before storing it in Firestore
      const hashedPassword = await hashText(password);

      // Store user data in Firestore (do not store plaintext passwords)
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: "user",
        password: hashedPassword,
        contact: contact,
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
    <div className="min-h-screen flex items-center justify-center bg-bfpNavy">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Sign Up Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <div className="absolute top-4 left-4 flex items-center">
            <img src={logo} alt="logo" className="h-12 w-12 mr-2" />
            <p className="font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[24px]">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>
          <div className="mt-20">
            <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[24px] text-center text-bfpNavy font-bold mb-2">
              Create an Account
            </h2>
            <p className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] text-bfpNavy mb-6">
              Sign up to get started with BFP SmartTrack.
            </p>
            <form className="space-y-6" onSubmit={handleSignUp}>
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

              {/* Admin Key Input is always displayed */}
              <div>
                <label htmlFor="adminkey" className="block text-sm font-medium text-gray-700">
                  Admin Key
                </label>
                <div className="relative">
                  <input
                    type={showAdminKey ? "text" : "password"}
                    id="adminkey"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                  >
                    {showAdminKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your contact number"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue text-white font-semibold rounded-md hover:bg-hoverBtn transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
              <p className="mt-4 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <span
                  className="text-blue cursor-pointer hover:underline"
                  onClick={() => navigate('/')}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2">
          <img
            src={signupImage}
            alt="Signup Visual"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
