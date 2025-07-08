import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/Firebase'; // Firestore configuration
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'; // Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods
import { toast } from 'react-toastify'; // Toast notification
import logo from '../login/LoginAssets/smarthardhatAsset 1.svg';
import { useAuth } from "../auth/AuthContext";

// Initialize Firebase Storage
const storage = getStorage();

function AddPersonnelModal({ isOpen, closeModal }) {
  const { userData} = useAuth();
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
  const [saving, setSaving] = useState(false); // To prevent multiple submissions

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
      setSaving(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Only allow numbers for the phone field
  if (name === 'phone') {
    const numericValue = value.replace(/\D/g, ''); // remove all non-digit characters
    setPersonnelInfo((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  } else {
    setPersonnelInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
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

  const logAction = async (actionType, data, userEmail) =>{
    try {
      await addDoc(collection(db, 'personnelAudit'), {
        action: actionType,
        data: data,
        user: userEmail,
        timestamp: serverTimestamp()
      });
    }catch (error){
      toast.error("Error logging action", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return; // Prevent double submission
    setSaving(true);

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

      await logAction("Add Personnel", { ...personnelInfo, image: imageUrl }, userData.email);

      // Close modal and show success message
      closeModal();
      toast.success('Personnel info saved successfully!');
    } catch (error) {
      toast.error('Error saving personnel info:', error);
      alert('Failed to save personnel info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!isOpen && 'hidden'}`}
    >
      <div className="bg-lightGray p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 relative">
        <div className="flex items-center mb-4">
          <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
          <p className="font-semibold text-lg">
            <span className="text-bfpOrange font-bold">BFP</span>
            <span className="text-bfpNavy">SmartTrack</span>
          </p>
        </div>
        <button onClick={closeModal} className="absolute top-2 right-2 text-red text-2xl font-bold hover:text-bfpNavy">
          X
        </button>
        <h2 className="text-xl font-bold mb-4 text-black text-center">Add Personnel Information</h2>

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
                inputMode='numeric'
                pattern="\d{11}"
                maxLength={11}
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
              <select
                id="position"
                name="position"
                value={personnelInfo.position}
                onChange={handleInputChange}
                className="w-full mt-1 px-2 py-1 border border-black rounded-md bg-white"
                required
              >
                <option value="" disabled>Select position</option>
                <option value="Fire Officer I">Fire Officer I</option>
                <option value="Fire Officer II">Fire Officer II</option>
                <option value="Fire Officer III">Fire Officer III</option>
                <option value="Senior Fire Officer">Senior Fire Officer</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Rescue Specialist">Rescue Specialist</option>
                <option value="Medic">Medic</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 bg-bfpNavy text-white font-semibold rounded-full hover:bg-hoverBtn transform transition duration-300 hover:scale-105"
            >
              {saving ? 'Saving...' : 'Save Personnel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPersonnelModal;
