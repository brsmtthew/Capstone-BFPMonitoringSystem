import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/Firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

function EditPersonnelModal({ isOpen, closeModal, personnelId, existingData }) {
  const [personnelInfo, setPersonnelInfo] = useState({
    gearId: '',
    name: '',
    position: '',
    age: '',
    birthdate: '',
    phone: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load existing data when the modal opens
  useEffect(() => {
    if (existingData) {
      setPersonnelInfo(existingData);
      setImagePreview(existingData.image || null);
    }
  }, [existingData]);

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
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting updated personnel info...');
      let imageUrl = personnelInfo.image;

      // Upload new image if file exists
      if (imageFile) {
        console.log('Uploading new image...');
        const storageRef = ref(storage, `personnelImages/${personnelInfo.gearId}/${personnelInfo.gearId}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Update Firestore document
      console.log('Updating Firestore document...');
      const personnelDocRef = doc(db, 'personnelInfo', personnelId);
      await updateDoc(personnelDocRef, {
        gearId: personnelInfo.gearId,
        name: personnelInfo.name,
        position: personnelInfo.position,
        age: personnelInfo.age,
        birthdate: personnelInfo.birthdate,
        phone: personnelInfo.phone,
        image: imageUrl,
      });

      alert('Personnel info updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error updating personnel info:', error);
      alert('Failed to update personnel info. Check the console for details.');
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
        <h2 className="text-xl font-bold mb-4">Edit Personnel Information</h2>

        <form className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleSubmit}>
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

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                placeholder="Enter Name"
              />
            </div>
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
                placeholder="Enter Position"
              />
            </div>
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
                placeholder="Enter Age"
              />
            </div>
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
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={personnelInfo.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Enter Phone Number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 bg-blue text-white font-semibold rounded-full hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPersonnelModal;
