import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase/Firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import DeletePersonnelModal from '../modal/deletePersonnelModal';
import AddPersonnelModal from '../modal/addPersonnelModal';

function PersonnelBody() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const navigate = useNavigate();

  // Fetch personnel data from Firestore
  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'personnelInfo'));
        const personnelData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPersonnel(personnelData);
      } catch (error) {
        console.error('Error fetching personnel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  // Open and Close Modals
  const openDeleteModal = (id, imagePath) => {
    setSelectedId(id);
    setSelectedImagePath(imagePath); // Pass the image path
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedId(null);
    setSelectedImagePath(null); // Clear the image path
  };

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  // Handle display personnel
  const handleDisplay = (member) => {
    navigate('/dashboard', { state: member });
  };

  // Delete personnel and image
  const handleDeletePersonnel = async () => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'personnelInfo', selectedId));

      // If there's an image path, delete the image from Firebase Storage
      if (selectedImagePath) {
        const imageRef = ref(storage, selectedImagePath);
        await deleteObject(imageRef);
        console.log('Image deleted successfully');
      }

      // Update the local state to reflect the deletion
      setPersonnel(personnel.filter((member) => member.id !== selectedId));
    } catch (error) {
      console.error('Error deleting personnel or image:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg text-gray-700">Loading...</p>;
  }

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      {/* Header */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2"></div>
          <p className="text-[26px] font-bold">PERSONNEL LIST</p>
        </div>
        {/* Add Personnel Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="text-white inline-flex items-center bg-blue hover:bg-yellow font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transform transition duration-300 hover:scale-105"
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
      </div>

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Card for Personnel Data */}
      <div className="bg-modalCard shadow-2xl rounded-xl p-6">
        {/* Grid for Personnel Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {personnel.length > 0 ? (
            personnel.map((member) => (
              <div
                key={member.id}
                className="bg-primeColor shadow-lg rounded-xl overflow-hidden"
              >
                {/* Image Section */}
                <div className="p-4 flex flex-col items-center">
                  <img
                    src={member.image || 'https://via.placeholder.com/150'}
                    alt={`${member.name}'s avatar`}
                    className="h-48 w-48 object-cover rounded-full shadow-md"
                  />
                  <h3 className="text-2xl font-bold text-center mt-4 text-white">
                    {member.name}
                  </h3>
                  <p className="text-lg font-medium text-center text-white">
                    {member.position}
                  </p>
                </div>

                {/* Details Section */}
                <div className="text-white px-8 py-2">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">ID:</span> {member.gearId}
                    </p>
                    <p>
                      <span className="font-semibold">Age:</span> {member.age}
                    </p>
                    <p>
                      <span className="font-semibold">Birthdate:</span> {member.birthdate}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {member.phone}
                    </p>
                  </div>
                </div>

                {/* Separator */}
                <div className="my-4 w-3/4 h-px bg-separator mx-auto"></div>

                {/* Button Section */}
                <div className="flex justify-around p-4">
                  <button
                    className="bg-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transform transition duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => handleDisplay(member)}
                  >
                    Display
                  </button>
                  <button
                    className="bg-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transform transition duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => openDeleteModal(member.id, member.imagePath)} // Pass imagePath here
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-300 col-span-full">
              No personnel data found.
            </p>
          )}
        </div>
      </div>

      {/* Add Personnel Modal */}
      <AddPersonnelModal isOpen={isAddModalOpen} closeModal={closeAddModal} />

      {/* Delete Personnel Modal */}
      {isDeleteModalOpen && (
        <DeletePersonnelModal
          isOpen={isDeleteModalOpen}
          closeModal={closeDeleteModal}
          handleDelete={handleDeletePersonnel} // Pass delete handler
        />
      )}
    </div>
  );
}

export default PersonnelBody;
