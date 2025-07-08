import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, secondaryAuth } from "../../firebase/Firebase";
import { setDoc, doc, addDoc, collection, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../login/LoginAssets/smarthardhatAsset 1.svg';
import { useAuth } from '../auth/AuthContext';

function AddUserModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword,  setShowPassword] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const { userData} = useAuth();

  // Helper: Hash a string using SHA-256
  const hashText = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const logAction = async (actionType, data, userEmail) => {
    try {
      await addDoc(collection(db, 'adminAudit'), {
        action: actionType,
        data: data,
        user: userEmail,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      toast.error("Error logging action: " + error.message, { position: "top-right" });
    }
  };

  // 1️⃣ Subscribe to count of admins
  useEffect(() => {
    const adminQuery = query(collection(db, "users"), where("role", "==", "admin"));
    const unsub = onSnapshot(adminQuery, snapshot => {
      setAdminCount(snapshot.size);
    });
    return unsub;
  }, []);

  const handleContactChange = (e) => {
    let digit = e.target.value.replace(/\D/g, '');
    if (digit.length > 11) digit = digit.slice(0, 11);
    setContact(digit);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !contact.trim()) {
      toast.error("Please fill in all required fields.", { position: "top-right" });
      return;
    }

    if (role === "admin" && adminCount >= 2) {
      toast.error("Maximum 2 admins allowed.", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      // Create the user using the secondary Firebase Auth instance
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;

      // Hash the password before storing it in Firestore
      const hashedPassword = await hashText(password);

      // Store user data in Firestore (avoid storing plaintext passwords)
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: role,
        password: hashedPassword,
        contact: contact,
        createdAt: new Date(),
      });
      await logAction("Add User", { email, role, contact }, userData.email);
      toast.success("User added successfully!", { position: "top-right" });

      // Clear form fields
      setEmail("");
      setPassword("");
      setContact("");
      setRole("user");

      // Optionally close the modal if onClose callback is provided
      if (onClose) onClose();

    } catch (err) {
      toast.error("Adding user failed. " + err.message, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">
        <div className="p-8 relative">
          {/* Logo */}
          <div className="absolute top-4 left-4 flex items-center">
            <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <p className="font-semibold text-lg">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-red text-2xl font-bold hover:text-bfpNavy">
            ✕
          </button>

          {/* Form Header */}
          <div className="mt-12">
            <h2 className="text-2xl text-center text-bfpNavy font-bold mb-4">
              Add New User
            </h2>
            <p className="text-center text-sm text-bfpNavy mb-6">
              Fill in the details to add a new user.
            </p>
            <form className="space-y-4" onSubmit={handleAddUser}>
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
                  placeholder="Enter user's email"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin" disabled={adminCount >= 2}>Admin {adminCount >= 2 ? "(limit reached)" : ""}</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle input type
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user's password"
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="contact"
                  inputMode='numeric'
                  maxLength={11}
                  pattern='\d{11}'
                  value={contact}
                  onChange={handleContactChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user's phone number"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-bfpNavy text-white font-semibold rounded-md hover:bg-hoverBtn transform transition duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Adding user...' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;
