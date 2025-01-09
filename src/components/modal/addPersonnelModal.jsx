import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/Firebase'; // Firestore configuration
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods

// Initialize Firebase Storage
const storage = getStorage();

function AddPersonnelModal({ isOpen, closeModal }) {
  const [personnelInfo, setPersonnelInfo] = useState({
    gearId: '',
    name: '',
    position: '',
    age: '',
    birthdate: '',
    phone: '',
  });

  const [imageFile, setImageFile] = useState(null); // State for uploaded image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  useEffect(() => {
    if (isOpen) {
      // Generate gearId when modal is opened
      const generateGearId = async () => {
        const gearId = await checkAndGenerateGearId();
        setPersonnelInfo((prev) => ({ ...prev, gearId }));
      };

      generateGearId();
    } else {
      // Reset personnelInfo, imageFile, and imagePreview when modal is closed
      setPersonnelInfo({
        gearId: '',
        name: '',
        position: '',
        age: '',
        birthdate: '',
        phone: '',
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);

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
    setImagePreview(file ? URL.createObjectURL(file) : null); // Generate preview URL or null
  };

  // Function to check if the gearId exists in Firestore and increment it
  const checkAndGenerateGearId = async () => {
    let newGearId = 'pr001';
    let isAvailable = false;

    while (!isAvailable) {
      const q = query(collection(db, 'personnelInfo'), where('gearId', '==', newGearId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        isAvailable = true; // gearId is available
      } else {
        // Increment gearId, e.g., from pr001 to pr002, pr003, etc.
        const num = parseInt(newGearId.slice(2), 10);
        newGearId = `pr${(num + 1).toString().padStart(3, '0')}`;
      }
    }

    return newGearId;
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
        gearId: personnelInfo.gearId,
        name: personnelInfo.name,
        position: personnelInfo.position,
        age: personnelInfo.age,
        birthdate: personnelInfo.birthdate,
        phone: personnelInfo.phone,
        image: imageUrl,
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
      <div className="bg-lightGray p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 relative">
        <button onClick={closeModal} className="absolute top-2 right-2 text-black">
          X
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Add Personnel Information</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="flex flex-col items-center space-x-4 text-black">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-36 h-36 object-cover rounded-full"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center bg-gray rounded-full">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <label
              htmlFor="image"
              className="block text-sm font-medium text-black cursor-pointer"
            >
              Upload Image
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-1 px-2 py-1 border border-gray rounded-md"
              />
            </label>
          </div>

          {/* Inline Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gear ID */}
            <div>
              <label htmlFor="gearId" className="block text-sm font-medium text-gray">
                Gear ID
              </label>
              <input
                type="text"
                id="gearId"
                name="gearId"
                value={personnelInfo.gearId}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-gray rounded-md"
                placeholder="Generating Gear ID..."
                disabled
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={personnelInfo.name}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-black rounded-md"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Birthdate */}
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-black">
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={personnelInfo.birthdate}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-black rounded-md"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={personnelInfo.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-black rounded-md"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-black">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={personnelInfo.position}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-black rounded-md"
                placeholder="Enter position"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-black">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={personnelInfo.age}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-black rounded-md"
                placeholder="Enter age"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 bg-bfpNavy text-white font-semibold rounded-full hover:bg-hoverBtn"
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
