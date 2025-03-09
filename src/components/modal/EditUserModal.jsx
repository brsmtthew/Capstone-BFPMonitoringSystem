import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../login/LoginAssets/smarthardhatAsset 1.svg";

function EditUserModal({ onClose, userId }) {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setEmail(userData.email || "");
        setContact(userData.contact || "");
        setRole(userData.role || "user");
        setPassword(userData.password || "");
      }
    };
    fetchUserData();
  }, [userId]);

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password || !contact.trim()) {
      toast.error("Please fill in all required fields.", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        email: email,
        password: password,
        role: role,
        contact: contact,
      });
      toast.success("User updated successfully!");
      console.log("User updated successfully!");
      if (onClose) onClose();
    } catch (err) {
      toast.error("Updating user failed. " + err.message, { position: "top-right" });
      console.error("Updating user failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8 relative">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 absolute top-4 left-4">
          <img src={logo} alt="logo" className="h-10 w-10" />
          <p className="font-semibold text-lg">
            <span className="text-bfpOrange font-bold">BFP</span>
            <span className="text-bfpNavy">SmartTrack</span>
          </p>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          ✕
        </button>

        {/* Modal Content */}
        <h2 className="text-xl text-bfpNavy font-bold text-center mt-12 mb-4">Edit User</h2>

        <form className="space-y-5" onSubmit={handleEditUser}>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray">Email</label>
            <input
              type="email"
              value={email}
              className="w-full mt-1 px-4 py-2 border border-gray text-white rounded-md bg-gray cursor-not-allowed"
              disabled
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              className="w-full mt-1 px-4 py-2 border border-gray rounded-md bg-gray cursor-not-allowed"
              disabled
            />
          </div> */}
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Contact Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Updating user..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
