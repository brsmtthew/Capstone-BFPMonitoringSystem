import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/Firebase";
import { collection, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import HeaderSection from "../header/HeaderSection";
import BodyCard from "../parentCard/BodyCard";
import { useStore } from "../store/useStore";
import AddPersonnelModal from "../modal/addPersonnelModal";
import EditPersonnelModal from "../modal/editPersonnelModal";
import DeletePersonnelModal from "../modal/deletePersonnelModal";
import { toast } from "react-toastify";

import { useAuth } from "../auth/AuthContext";

function PersonnelBody() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [expandedPersonnel, setExpandedPersonnel] = useState(null); // State to manage expanded card

  const { user, userData } = useAuth();

  // Accessing the monitored personnel list from the store
  const {
    monitoredPersonnel,
    addMonitoredPersonnel,
    removeMonitoredPersonnel,
    clearSavingState,
  } = useStore();

  // Log action function to record deletion events (and others if needed)
  const logAction = async (actionType, data, userEmail) => {
    try {
      await addDoc(collection(db, 'personnelAudit'), {
        action: actionType,
        data: data,
        user: userEmail,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      toast.error(`Error logging action: ${error.message}`);
    }
  };

  // Fetch personnel data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "personnelInfo"),
      (querySnapshot) => {
        const personnelData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPersonnel(personnelData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle click to monitor a personnel
  const handleMonitor = (person) => {
    addMonitoredPersonnel(person);
    navigate("/monitoring", { state: { selectedPersonnel: person } });
  };

  // Handle click to remove a personnel from monitoring
  const handleRemove = (person) => {
    removeMonitoredPersonnel(person.gearId); // Remove by gearId
    clearSavingState(person.gearId); // Clear the saving state
  };

  // Handle click to delete a personnel
  const handleDelete = async (person) => {
    try {
      await deleteDoc(doc(db, "personnelInfo", person.id));
      setPersonnel(personnel.filter((p) => p.id !== person.id));
      await logAction("Delete Personnel", person, userData.email);
    } catch (error) {
      toast.error("Error deleting personnel:", error);
    } finally {
      closeDeleteModal();
    }
  };

  const openAddModal = (personnel = null) => {
    setSelectedPersonnel(personnel); // Set selected personnel for editing (or null for adding)
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setSelectedPersonnel(null); // Clear selected personnel on close
  };

  const openEditModal = (personnel = null) => {
    setSelectedPersonnel(personnel); // Set selected personnel for editing (or null for adding)
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setSelectedPersonnel(null); // Clear selected personnel on close
  };

  const openDeleteModal = (personnel = null) => {
    setSelectedPersonnel(personnel); // Set selected personnel for editing (or null for adding)
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setSelectedPersonnel(null); // Clear selected personnel on close
  };

  const toggleExpand = (personId) => {
    setExpandedPersonnel(expandedPersonnel === personId ? null : personId);
  };

  useEffect(() => {
    console.log("User:", user);
    console.log("User Data:", userData);
  }, [user, userData]);

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white font-montserrat">
      <HeaderSection
        title="PERSONNEL LIST"
        extraContent={
          <button
            type="button"
            onClick={openAddModal}
            className="text-white inline-flex items-center bg-bfpNavy hover:bg-hoverBtn font-medium rounded-lg text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] px-2 py-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 2xl:px-5 sm:py-2 lg:py-2 xl:py-2.5 2xl:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transform transition duration-300 hover:scale-105">
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"></path>
            </svg>
            Add Personnel
          </button>
        }
      />
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* <div className="p-4 bg-gray rounded-md mb-4">
        <h2 className="text-lg font-bold text-gray-800">User Info</h2>
        <p className="text-sm text-gray-700"><strong>Email:</strong> {userData?.email || "Not logged in"}</p>
        <p className="text-sm text-gray-700"><strong>Role:</strong> {userData?.role || "No role assigned"}</p>
      </div> */}

      {loading ? (
        <p className="text-center mt-10 text-lg text-gray">Loading...</p>
      ) : (
        <div>
          <BodyCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {personnel.length > 0 ? (
                personnel.map((person) => (
                  <div
                    key={person.id}
                    className="bg-bfpNavy shadow-lg rounded-xl overflow-hidden p-4 flex flex-col items-center cursor-pointer"
                    onDoubleClick={() => toggleExpand(person.id)}>
                    <img
                      src={person.image || "https://via.placeholder.com/150"}
                      alt={person.name}
                      className="w-24 h-24 rounded-full mb-4"
                    />
                    <h3 className="text-lg font-bold text-white">
                      {person.name}
                    </h3>
                    <p className="text-sm text-white">{person.position}</p>
                    <p className="text-sm text-white">{person.gearId}</p>
                    {expandedPersonnel === person.id && (
                      <div className="mt-4 text-white">
                        <p>
                          <strong>Age:</strong> {person.age}
                        </p>
                        <p>
                          <strong>Birthdate:</strong> {person.birthdate}
                        </p>
                        <p>
                          <strong>Phone:</strong> {person.phone}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-hoverBtn transform transition duration-300 hover:scale-105"
                        onClick={() => openEditModal(person)}>
                        Edit
                      </button>
                      {!monitoredPersonnel.some(
                        (monitored) => monitored.gearId === person.gearId
                      ) ? (
                        <button
                          className="bg-green text-white hover:bg-hoverBtn hover:scale-105 px-4 py-2 rounded-lg transition duration-300"
                          onClick={() => handleMonitor(person)}>
                          Active
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-red text-white rounded-lg hover:bg-bfpOrange transform transition duration-300 hover:scale-105"
                          onClick={() => handleRemove(person)}>
                          Remove
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-red text-white rounded-lg hover:bg-hoverBtn transform transition duration-300 hover:scale-105"
                        onClick={() => openDeleteModal(person)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray">No personnel available.</p>
              )}
            </div>
          </BodyCard>
        </div>
      )}
      <AddPersonnelModal
        isOpen={isAddModalOpen}
        closeModal={closeAddModal}
        selectedPersonnel={selectedPersonnel}
      />

      <EditPersonnelModal
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        selectedPersonnel={selectedPersonnel}
      />

      <DeletePersonnelModal
        isOpen={isDeleteOpen}
        closeModal={closeDeleteModal}
        onConfirm={handleDelete}
        personnel={selectedPersonnel}
      />
    </div>
  );
}

export default PersonnelBody;
