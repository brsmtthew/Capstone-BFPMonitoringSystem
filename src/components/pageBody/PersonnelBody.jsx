import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';
import { useStore } from '../store/useStore';
import AddPersonnelModal from '../modal/addPersonnelModal';

function PersonnelBody() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); 

  // Accessing the monitored personnel list from the store
  const { monitoredPersonnel, addMonitoredPersonnel, removeMonitoredPersonnel } = useStore();

  // Fetch personnel data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'personnelInfo'), (querySnapshot) => {
      const personnelData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersonnel(personnelData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle click to monitor a personnel
  const handleMonitor = (person) => {
    addMonitoredPersonnel(person);
    navigate('/monitoring', { state: { selectedPersonnel: person } });
  };

  // Handle click to remove a personnel from monitoring
  const handleRemove = (person) => {
    removeMonitoredPersonnel(person.gearId); // Remove by gearId
  };

  const openAddModal = (personnel = null) => {
    setSelectedPersonnel(personnel); // Set selected personnel for editing (or null for adding)
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setSelectedPersonnel(null); // Clear selected personnel on close
  };

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      <HeaderSection
        title="PERSONNEL LIST"
        extraContent={
          <button
            type="button"
            onClick={openAddModal}
            className="text-white inline-flex items-center bg-bfpNavy hover:bg-hoverBtn font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transform transition duration-300 hover:scale-105"
          >
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Add Personnel
          </button>
        }
      />

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {loading ? (
        <p className="text-center mt-10 text-lg text-gray-700">Loading...</p>
      ) : (
        <BodyCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {personnel.length > 0 ? (
              personnel.map((person) => (
                <div
                  key={person.id}
                  className="bg-primeColor shadow-lg rounded-xl overflow-hidden p-4 flex flex-col items-center"
                >
                  <img
                    src={person.image || 'https://via.placeholder.com/150'}
                    alt={person.name}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h3 className="text-lg font-bold text-white">{person.name}</h3>
                  <p className="text-sm text-white">{person.position}</p>
                  <p className="text-sm text-white">{person.gearId}</p>
                  {!monitoredPersonnel.some((monitored) => monitored.gearId === person.gearId) ? (
                    <button
                      className="mt-4 px-4 py-2 bg-bfpNavy text-white rounded-lg hover:bg-hoverBtn"
                      onClick={() => handleMonitor(person)}
                    >
                      Monitor
                    </button>
                  ) : (
                    <button
                      className="mt-4 px-4 py-2 bg-red text-white rounded-lg hover:bg-red-700"
                      onClick={() => handleRemove(person)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray">No personnel available.</p>
            )}
          </div>
        </BodyCard>
      )}
      <AddPersonnelModal 
      isOpen={isAddModalOpen} 
      closeModal={closeAddModal} 
      selectedPersonnel={selectedPersonnel}
      />
    </div>
  );
}

export default PersonnelBody;
