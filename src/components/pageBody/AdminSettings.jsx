import React, { useState, useEffect } from "react";
import HeaderSection from "../header/HeaderSection";
import BodyCard from "../parentCard/BodyCard";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import searchIcon from "../pageBody/dashboardAssets/glass.png";
import EditIcon from "../pageBody/dashboardAssets/edit.png";
import DeleteIcon from "../pageBody/dashboardAssets/delete.png";
import AddUserModal from "../modal/AddUserModal";
import EditUserModal from "../modal/EditUserModal";
import DeletePersonnelModal from "../modal/deletePersonnelModal";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import AccountTable from "../account/AccountTable";

function AdminSettings() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [expandedPersonnel, setExpandedPersonnel] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const usersData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.email.localeCompare(b.email));
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = users
      .filter((user) => user.email)
      .filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((user) => roleFilter === "all" || user.role === roleFilter);

    setFilteredUsers(filtered);
  }, [searchTerm, users, roleFilter]);

  const logAction = async (actionType, data, userEmail) => {
    try {
      await addDoc(collection(db, "adminAudit"), {
        action: actionType,
        data: data,
        user: userEmail,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      toast.error("Error logging action: " + error.message, {
        position: "top-right",
      });
    }
  };

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setShowEditUserModal(true);
  };

  const handleRowDoubleClick = (user) => {
    // Toggle the expanded row on double-click
    setExpandedPersonnel(expandedPersonnel === user ? null : user);
  };

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteUserModal(true);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      const userToDelete = users.find((user) => user.id === userId);
      const username = userToDelete.email.split("@")[0];
      const formatted = username.charAt(0).toUpperCase() + username.slice(1);
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
      await logAction(
        "Delete User",
        {
          email: userToDelete.email,
          role: userToDelete.role,
          contact: userToDelete.contact,
        },
        userData.email
      );
      toast.error(`${formatted} has been deleted.`, { position: "top-right" });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user: " + error.message, {
        position: "top-right",
      });
    } finally {
      setShowDeleteUserModal(false);
    }
  };

  const handleBlock = async (userId) => {
    try {
      const userToBlock = users.find((user) => user.id === userId);
      const username = userToBlock.email.split("@")[0];
      const formatted = username.charAt(0).toUpperCase() + username.slice(1);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isBlock: true });
      await logAction(
        "Block User",
        {
          email: userToBlock.email,
          role: userToBlock.role,
          contact: userToBlock.contact,
        },
        userData.email
      );
      toast.warn(`${formatted} has been blocked.`, { position: "top-right" });
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Error blocking user: " + error.message, {
        position: "top-right",
      });
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const userToBlock = users.find((user) => user.id === userId);
      const username = userToBlock.email.split("@")[0];
      const formatted = username.charAt(0).toUpperCase() + username.slice(1);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isBlock: false });
      await logAction(
        "Unblock User",
        {
          email: userToBlock.email,
          role: userToBlock.role,
          contact: userToBlock.contact,
        },
        userData.email
      );
      toast.success(`${formatted} has been unblocked.`, {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Error unblocking user: " + error.message, {
        position: "top-right",
      });
    }
  };

  const openAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const openEditUserModal = (userId) => {
    setShowEditUserModal(true);
  };

  const closeEditUserModal = () => {
    setShowEditUserModal(false);
  };

  const protectedEmail = "acemalasaga30@gmail.com";
  const isProtected = (email) =>
    email === protectedEmail || email === userData.email;
  const { userData } = useAuth();

  return (
    <div className="p-4 min-h-screen flex flex-col bg-white font-montserrat">
      <HeaderSection
        title="MANAGE ACCOUNT"
        extraContent={
          <button
            className="text-white inline-flex items-center bg-bfpNavy hover:bg-hoverBtn font-medium rounded-lg 
             text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] 
             px-2 py-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 2xl:px-5 sm:py-2 lg:py-2 xl:py-2.5 2xl:py-2.5 
             text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 
             transform transition duration-300 hover:scale-105"
            onClick={openAddUserModal}
            type="button">
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Account
          </button>
        }
      />
      <div className="my-2 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      <BodyCard>
        <div className="bg-bfpNavy rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
            {/* Role Filter Dropdown */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-sm text-white bg-bfpNavy border border-white rounded-lg px-4 py-2">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              {/* Add more roles if needed */}
            </select>

            {/* Search Input */}
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for users"
                className="block p-2 pl-10 text-sm text-white bg-bfpNavy border border-white rounded-lg w-full md:w-80"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src={searchIcon} alt="Search" className="w-4 h-4" />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-white text-center py-6">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-white text-center py-6">No users found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-white bg-bfpNavy">
                  <thead className="text-xs uppercase bg-searchTable text-white">
                    <tr>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Created at</th>
                      <th className="px-6 py-3">Last Login</th>
                      <th className="px-6 py-3">Access</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr
                          onDoubleClick={() => handleRowDoubleClick(user)}
                          className="border-b bg-bfpNavy hover:bg-searchTable cursor-pointer">
                          <td className="px-6 py-3">{user.email}</td>
                          <td className="px-6 py-3">{user.role}</td>
                          <td className="px-6 py-3">
                            {user.createdAt
                              ? new Date(
                                  user.createdAt.seconds * 1000
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-3">
                            {user.lastLogin
                              ? new Date(
                                  user.lastLogin.seconds * 1000
                                ).toLocaleString()
                              : "Never"}
                          </td>
                          <td className="px-6 py-3">
                            {user.isBlock ? (
                              <button
                                onClick={() =>
                                  !isProtected(user.email) &&
                                  handleUnblock(user.id)
                                }
                                disabled={isProtected(user.email)}
                                className={`${
                                  isProtected(user.email)
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:opacity-80 bg-green px-2 py-1 rounded"
                                }`}>
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  !isProtected(user.email) &&
                                  handleBlock(user.id)
                                }
                                disabled={isProtected(user.email)}
                                className={`${
                                  isProtected(user.email)
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:opacity-80 bg-red px-2 py-1 rounded"
                                }`}>
                                Block
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex space-x-4">
                              <button
                                onClick={() =>
                                  !isProtected(user.email) &&
                                  handleEdit(user.id)
                                }
                                disabled={isProtected(user.email)}
                                className={`${
                                  isProtected(user.email)
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:opacity-80"
                                }`}>
                                <img
                                  src={EditIcon}
                                  alt="Edit"
                                  className="w-6 h-6"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  !isProtected(user.email) &&
                                  handleDelete(user.id)
                                }
                                disabled={isProtected(user.email)}
                                className={`${
                                  isProtected(user.email)
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:opacity-80"
                                }`}>
                                <img
                                  src={DeleteIcon}
                                  alt="Delete"
                                  className="w-6 h-6"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedPersonnel === user && (
                          <tr className="bg-bfpNavy">
                            <td colSpan="6">
                              <AccountTable selectedPersonnel={user} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-searchTable rounded-lg shadow-md p-4 mb-4">
                    {/* Email at the top */}
                    <h3 className="text-lg font-bold text-white">
                      {user.email}
                    </h3>
                    {/* Role */}
                    <div className="mt-2 text-white text-sm">
                      <p>
                        <span className="font-semibold">Role:</span> {user.role}
                      </p>
                    </div>
                    {/* Last Login */}
                    <div className="mt-2 text-white text-sm">
                      <p>
                        <span className="font-semibold">Last Login:</span>{" "}
                        {user.lastLogin
                          ? new Date(
                              user.lastLogin.seconds * 1000
                            ).toLocaleString()
                          : "Never"}
                      </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-between mt-2">
                      {user.isBlock ? (
                        <button
                          onClick={() =>
                            !isProtected(user.email) && handleUnblock(user.id)
                          }
                          disabled={isProtected(user.email)}
                          className={`bg-green px-3 py-2 rounded-lg text-white ${
                            isProtected(user.email) &&
                            "opacity-50 cursor-not-allowed"
                          }`}>
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            !isProtected(user.email) && handleBlock(user.id)
                          }
                          disabled={isProtected(user.email)}
                          className={`bg-red px-3 py-2 rounded-lg text-white ${
                            isProtected(user.email) &&
                            "opacity-50 cursor-not-allowed"
                          }`}>
                          Block
                        </button>
                      )}
                      <button
                        onClick={() =>
                          !isProtected(user.email) && handleEdit(user.id)
                        }
                        disabled={isProtected(user.email)}
                        className={`bg-bfpOrange px-3 py-2 rounded-lg text-white ${
                          isProtected(user.email) &&
                          "opacity-50 cursor-not-allowed"
                        }`}>
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          !isProtected(user.email) && handleDelete(user.id)
                        }
                        disabled={isProtected(user.email)}
                        className={`bg-blue px-3 py-2 rounded-lg text-white ${
                          isProtected(user.email) &&
                          "opacity-50 cursor-not-allowed"
                        }`}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </BodyCard>

      {showAddUserModal && <AddUserModal onClose={closeAddUserModal} />}
      {showEditUserModal && (
        <EditUserModal onClose={closeEditUserModal} userId={selectedUserId} />
      )}
      {showDeleteUserModal && (
        <DeletePersonnelModal
          isOpen={showDeleteUserModal}
          closeModal={() => setShowDeleteUserModal(false)}
          onConfirm={handleConfirmDelete}
          personnel={selectedUserId}
        />
      )}
    </div>
  );
}

export default AdminSettings;
