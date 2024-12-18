import React, { useState, useEffect } from 'react';
import AddPersonnelModal from '../modal/addPersonnelModal';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/Firebase'; // Ensure correct import
import { collection, getDocs } from 'firebase/firestore';
import HeaderSection from '../header/HeaderSection';

function DashboardBody() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Open/close modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch personnel data from Firestore
  const fetchPersonnelData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'personnelInfo'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersonnel(data);
    } catch (error) {
      console.error('Error fetching personnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnelData();
  }, []); // Fetch data once when the component mounts

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % personnel.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? personnel.length - 1 : prevIndex - 1
    );
  };

  // Fetch image dynamically if the image is just a path
  const fetchImageUrl = async (imagePath) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath); // Path from Firestore
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error fetching image from Firebase Storage:', error);
      return 'https://via.placeholder.com/300x300'; // Fallback image URL
    }
  };

  // Loading state
  if (loading) {
    return <p className="text-center mt-10 text-lg text-gray-700">Loading...</p>;
  }

  // If no personnel data is found
  if (personnel.length === 0) {
    return <p>No personnel data found.</p>;
  }

  return (
    <div className="p-4 h-screen flex flex-col lg:bg-gray-50">
      {/* Header Section */}
      <HeaderSection title="DASHBOARD"/>

      <div className="my-4 h-[2px] bg-gray w-[80%] mx-auto" />

      {/* Main Card */}
      <div className="bg-bodyDash shadow-md rounded-xl p-6 lg:p-10">
        {/* Bento Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* 1st card - Personnel Profile */}
          <div className="relative lg:row-span-2 flex flex-col bg-gray-100 rounded-lg shadow bg-white h-64">
            <div className="absolute top-0 left-0 bg-bfpNavy w-full p-4 text-white rounded-t-lg rounded-xl">
              <h4 className="text-xl font-semibold">{personnel[currentImageIndex].name}</h4>
              <p className="text-sm">{personnel[currentImageIndex].position}</p>
            </div>
            <div className="p-6 mt-12 text-black">
              <h3 className="text-lg font-medium mt-4">Personnel</h3>
              <p className="text-sm">Swipe to view different personnel profiles.</p>
            </div>
            <div className="relative grow flex items-center justify-center">
              {/* Fetch image URL dynamically if the image is a path */}
              <img
                className="h-52 w-52 rounded-full object-cover"
                src={personnel[currentImageIndex].image.startsWith('https') // Check if it's already a URL
                  ? personnel[currentImageIndex].image 
                  : fetchImageUrl(personnel[currentImageIndex].image)} 
                alt={`Personnel ${currentImageIndex + 1}`}
              />
            </div>
            <div className="flex justify-between p-4">
              <button className="text-sm text-white bg-bfpNavy px-4 py-2 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-solidGreen" onClick={prevImage}>
                Previous
              </button>
              <button className="text-sm text-white bg-bfpNavy px-4 py-2 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-solidGreen" onClick={nextImage}>
                Next
              </button>
            </div>
          </div>

          {/* Other Cards */}
          {/* 2nd card - Battery/Power Status */}
          <div className="bg-white relative flex flex-col bg-gray-100 rounded-lg shadow h-48">
            <div className="p-4 bg-bfpNavy rounded-lg text-white">
              <h3 className="text-lg font-medium">Battery Status</h3>
              <p className="text-sm">Live monitoring of device battery levels.</p>
            </div>
            <div className="relative grow flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">85%</p>
                <p className="text-sm text-gray-600">Battery Remaining</p>
              </div>
            </div>
          </div>

          {/* 3rd card - Health Status */}
          <div className="bg-white relative flex flex-col bg-gray-100 rounded-lg shadow h-48">
            <div className="p-4 bg-bfpNavy rounded-lg text-white">
              <h3 className="text-lg font-medium text-gray-800">Health Status</h3>
              <p className="text-sm text-gray-600">
                Monitoring heart rate and body temperature.
              </p>
            </div>
            <div className="relative grow flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-gray-800">Heart Rate: 72 BPM</p>
                <p className="text-lg text-gray-800">Temperature: 36.5°C</p>
              </div>
            </div>
          </div>

          {/* 4th card - Environmental Conditions */}
          <div className="bg-white relative lg:row-span-2 flex flex-col bg-gray-100 rounded-lg shadow h-48">
            <div className="p-4 bg-bfpNavy rounded-lg text-white">
              <h3 className="text-lg font-medium text-gray-800">Environmental Conditions</h3>
              <p className="text-sm text-gray-600">
                Real-time environmental data: temperature, smoke, etc.
              </p>
            </div>
            <div className="relative grow flex flex-col items-center justify-center">
              <p className="text-lg text-gray-800">Temperature: 30°C</p>
              <p className="text-lg text-gray-800">Smoke: Normal</p>
              <p className="text-lg text-gray-800">Gas Levels: Safe</p>
            </div>
          </div>

          {/* 5th card - System Overview */}
          <div className="bg-white relative lg:row-span-2 flex flex-col bg-gray-100 rounded-lg shadow h-48">
            <div className="p-4 bg-headerDash rounded-lg text-white">
              <h3 className="text-lg font-medium text-gray-800">System Overview</h3>
              <p className="text-sm text-gray-600">Summary of active alerts and system status.</p>
            </div>
            <div className="relative grow flex flex-col items-center justify-center">
              <p className="text-lg text-gray-800">Active Alerts: 3</p>
              <p className="text-lg text-gray-800">Resolved Alerts: 12</p>
              <p className="text-lg text-gray-800">System Uptime: 24 hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;
