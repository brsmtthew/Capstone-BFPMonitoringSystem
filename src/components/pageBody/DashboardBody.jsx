import React, { useState, useEffect } from 'react';
import AddPersonnelModal from '../modal/addPersonnelModal';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import HeaderSection from '../header/HeaderSection';
import OverviewCard from '../DashboardCard/OverviewCard';
import ProfileCard from '../DashboardCard/ProfileCard';
import BodyCard from '../parentCard/BodyCard';
import DashboardChart from '../chart/DashboardChart';

function DashboardBody() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [analyticsData, setAnalyticsData] = useState({ realTimeData: [], personnelInfo: {} });

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
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-bfpNavy h-14 w-14"></div>
      </div>
    );
  }

  if (personnel.length === 0) {
    return <p>No personnel data found.</p>;
  }

  return (
    <div className="p-4 h-full flex flex-col bg-white font-montserrat">
      <HeaderSection title="DASHBOARD" />

      <div className="my-4 h-[3px] bg-separatorLine w-[80%] mx-auto" />


      {/* Parent Card */}
      <BodyCard>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:grid-rows-2 grid-flow-row-dense">
          {/* Profile Card - Takes up 1st column across both rows */}
          <div className="lg:row-span-2">
            <ProfileCard
              name={personnel[currentImageIndex].name}
              position={personnel[currentImageIndex].position}
              image={personnel[currentImageIndex].image}
              onPrevious={prevImage}
              onNext={nextImage}
              fetchImageUrl={fetchImageUrl}
            />
          </div>

          {/* Overview Cards - Row 1, Columns 2 and 3 */}
          <OverviewCard title="Total Personnel" description="The total number of personnel currently registered.">
            <p className="text-[64px] font-bold text-black">{personnel.length}</p>
            <p className='text-[28px] font-bold text-black'>Total Personnel</p>
          </OverviewCard>

          <OverviewCard title="Battery Status" description="Live monitoring of device battery levels.">
            <p className="text-[42px] font-bold text-black">85%</p>
            <p className="text-sm text-black">Battery Remaining</p>
          </OverviewCard>

          {/* DashboardChart - Spanning columns 2 and 3 in Row 2 */}
          <div className="lg:col-span-2 max-w-[1150px]">
            <DashboardChart />
          </div>
        </div>
      </BodyCard>
      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;
