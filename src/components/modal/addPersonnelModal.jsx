import React, { useState } from 'react';
import { db } from '../../firebase/Firebase'; // Firestore configuration
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods

// Initialize Firebase Storage
const storage = getStorage();

function AddPersonnelModal({ isOpen, closeModal }) {
  const [personnelInfo, setPersonnelInfo] = useState({
    gearId: '', // Renamed id to gearId
    name: '',
    position: '',
    age: '',
    birthdate: '',
    phone: '',
  });

  const [imageFile, setImageFile] = useState(null); // State for uploaded image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonnelInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Generate preview URL for the image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';

      // Upload image to Firebase Storage if there's an image file
      if (imageFile) {
        const storageRef = ref(storage, `personnelImages/${personnelInfo.gearId}/${personnelInfo.gearId}`);

        await uploadBytes(storageRef, imageFile); // Upload file
        imageUrl = await getDownloadURL(storageRef); // Get public URL
      }

      // Save personnel info to Firestore with gearId and image URL
      await addDoc(collection(db, 'personnelInfo'), {
        gearId: personnelInfo.gearId, // Save gearId instead of id
        name: personnelInfo.name,
        position: personnelInfo.position,
        age: personnelInfo.age,
        birthdate: personnelInfo.birthdate,
        phone: personnelInfo.phone,
        image: imageUrl, // Save image URL in Firestore
      });

      // Close modal and show success message
      closeModal();
      alert('Personnel info saved successfully!');
    } catch (error) {
      console.error('Error saving personnel info:', error);
      alert('Failed to save personnel info');
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 relative">
        <button onClick={closeModal} className="absolute top-2 right-2 text-black">
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Add Personnel Information</h2>

        <form className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full"
                />
              )}
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 cursor-pointer"
              >
                Upload Image
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* Gear ID Field */}
            <div>
              <label htmlFor="gearId" className="block text-sm font-medium text-gray-700">
                Gear ID
              </label>
              <input
                type="text"
                id="gearId"
                name="gearId"
                value={personnelInfo.gearId}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Enter Gear ID"
              />
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={personnelInfo.name}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            {/* Position Field */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={personnelInfo.position}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Enter position"
              />
            </div>

            {/* Age Field */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={personnelInfo.age}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Enter age"
              />
            </div>

            {/* Birthdate Field */}
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={personnelInfo.birthdate}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={personnelInfo.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 bg-blue text-white font-semibold rounded-full hover:bg-blue-700"
            >
              Save Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPersonnelModal;
