import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/Firebase'; // Firestore configuration
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods
import { toast } from 'react-toastify'; // Toast notification
import logo from '../login/LoginAssets/smarthardhatAsset 1.svg';
import { useAuth } from "../auth/AuthContext"; 

// Initialize Firebase Storage
const storage = getStorage();

function EditPersonnelModal({ isOpen, closeModal, selectedPersonnel }) {
  const { userData } = useAuth();
  const [ saving, setSaving] = useState(false);
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
    if (isOpen && selectedPersonnel) {
      setPersonnelInfo({
        gearId: selectedPersonnel.gearId || '',
        name: selectedPersonnel.name || '',
        position: selectedPersonnel.position || '',
        age: selectedPersonnel.age || '',
        birthdate: selectedPersonnel.birthdate || '',
        phone: selectedPersonnel.phone || '',
      });
      setImagePreview(selectedPersonnel.image || null);
    } else {
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
  }, [isOpen, selectedPersonnel]);

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

  // Log action function to track edits
  const logAction = async (actionType, data, userEmail) => {
    try {
      await addDoc(collection(db, 'personnelAudit'), {
        action: actionType,
        data: data,
        user: userEmail,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      toast.error("Error logging action", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return; // Prevent multiple submissions
    setSaving(true);

    try {
      let imageUrl = imagePreview;

      // Upload image to Firebase Storage if there's a new image file
      if (imageFile) {
        const storageRef = ref(storage, `personnelImages/${personnelInfo.gearId}/${personnelInfo.gearId}`);
        await uploadBytes(storageRef, imageFile); // Upload file
        imageUrl = await getDownloadURL(storageRef); // Get public URL
      }

      // Update existing personnel info in Firestore
      const docRef = doc(db, 'personnelInfo', selectedPersonnel.id);
      await updateDoc(docRef, {
        name: personnelInfo.name,
        position: personnelInfo.position,
        age: personnelInfo.age,
        birthdate: personnelInfo.birthdate,
        phone: personnelInfo.phone,
        image: imageUrl,
      });

      await logAction("Edit Personnel", { ...personnelInfo, image: imageUrl }, userData.email);

      // Close modal and show success message
      closeModal();
      toast.success('Personnel info updated successfully!');
    } catch (error) {
      toast.error('Error updating personnel info:', error);
      console.error('Error updating personnel info:', error);
    } finally {
      setSaving(false)
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!isOpen && 'hidden'}`}>
      <div className="bg-lightGray p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 relative">
        <div className="flex items-center mb-4">
          <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <p className="font-semibold text-lg">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>
        <button onClick={closeModal} className="absolute top-2 right-2 text-black">
          X
        </button>
        <h2 className="text-xl font-bold mb-4 text-black text-center">Edit Personnel Information</h2>

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
            disabled={saving}
            className="w-1/2 py-2 bg-bfpNavy text-white font-semibold rounded-full hover:bg-hoverBtn"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPersonnelModal;