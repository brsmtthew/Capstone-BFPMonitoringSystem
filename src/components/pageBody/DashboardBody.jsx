import React, { useState, useEffect } from 'react';
import AddPersonnelModal from '../modal/addPersonnelModal';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import HeaderSection from '../header/HeaderSection';
import OverviewCard from '../DashboardCard/OverviewCard';
import ProfileCard from '../DashboardCard/ProfileCard';
import BodyCard from '../parentCard/BodyCard';

function DashboardBody() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to fetch personnel data from Firestore
  const fetchPersonnelData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'personnelInfo'));
      const data = querySnapshot.docs.map((doc) => ({
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

  // Next image logic
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % personnel.length);
  };

  // Previous image logic
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? personnel.length - 1 : prevIndex - 1
    );
  };

  // Function to fetch image URL from Firebase Storage
  const fetchImageUrl = async (imagePath) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error fetching image from Firebase Storage:', error);
      return 'https://via.placeholder.com/300x300'; // fallback URL if there's an error
    }
  };

  useEffect(() => {
    fetchPersonnelData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-b-4 border-bfpOrange h-16 w-16"></div>
      </div>
    );
  }

  if (personnel.length === 0) {
    return <p>No personnel data found.</p>;
  }

  return (
    <div className="p-4 h-full flex flex-col bg-white">
      <HeaderSection title="DASHBOARD" />

      <div className="my-4 h-[3px] bg-separatorLine w-[80%] mx-auto" />


      {/* Parent Card */}
      <BodyCard>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* Personnel Profile */}
          <ProfileCard
            name={personnel[currentImageIndex].name}
            position={personnel[currentImageIndex].position}
            image={personnel[currentImageIndex].image}
            onPrevious={prevImage}
            onNext={nextImage}
            fetchImageUrl={fetchImageUrl}
          />

          {/* Other Cards */}
          <OverviewCard title="Total Personnel" description="The total number of personnel currently registered.">
            <p className="text-[64px] font-bold text-black">{personnel.length}</p>
            <p className='text-[28px] font-bold text-black'>Total Personnel</p>
          </OverviewCard>

          <OverviewCard title="Battery Status" description="Live monitoring of device battery levels.">
            <p className="text-[42px] font-bold text-black">85%</p>
            <p className="text-sm text-black">Battery Remaining</p>
          </OverviewCard>

          <OverviewCard title="Environmental Conditions" description="Real-time environmental data: temperature, smoke, etc.">
            <p className="text-lg text-black">Temperature: 30°C</p>
            <p className="text-lg text-black">Smoke: Normal</p>
            <p className="text-lg text-black">Gas Levels: Safe</p>
          </OverviewCard>

          <OverviewCard title="System Overview" description="Summary of active alerts and system status.">
            <p className="text-lg text-black">Active Alerts: 3</p>
            <p className="text-lg text-black">Resolved Alerts: 12</p>
            <p className="text-lg text-black">System Uptime: 24 hrs</p>
          </OverviewCard>
        </div>
      </BodyCard>
      

      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;
