import React, { useState, useEffect, useRef } from 'react';
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
  
  // State for the analytics data which includes our realTimeData and personnel info (if needed)
  const [analyticsData, setAnalyticsData] = useState({
    realTimeData: [],
    notifications: [],
    personnelInfo: {}
  });

  const fetchedOnceRef = useRef(false);
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

  // Fetch realTimeData from a randomly chosen document in the "personnelRecords" collection.
  const fetchRandomRealTimeData = async () => {
    try {
      // Get all documents from the "personnelRecords" collection.
      const personnelRecordsSnapshot = await getDocs(collection(db, 'personnelRecords'));
      if (!personnelRecordsSnapshot.empty) {
        const records = personnelRecordsSnapshot.docs;

        // If only one record exists, randomIndex will be 0.
        const randomIndex = records.length === 1 
          ? 0 
          : Math.floor(Math.random() * records.length);
        const randomPersonnelDoc = records[randomIndex];
        console.log('Selected personnel record:', randomPersonnelDoc.id, randomPersonnelDoc.data());

        // Get the "realTimeData" subcollection for the chosen personnel record.
        const realTimeDataSnapshot = await getDocs(
          collection(db, 'personnelRecords', randomPersonnelDoc.id, 'realTimeData')
        );
        const realTimeData = realTimeDataSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // **New:** Get the "notification" subcollection for the chosen personnel record.
        const notificationSnapshot = await getDocs(
          collection(db, 'personnelRecords', randomPersonnelDoc.id, 'notifications')
        );
        const notificationsData = notificationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched realTimeData:', realTimeData);
        console.log('Fetch Notifications:', notificationsData);

        // Update state with the fetched realTimeData and any personnel info if needed.
        setAnalyticsData({
          realTimeData: realTimeData,
          notifications: notificationsData,
          personnelInfo: randomPersonnelDoc.data(),
        });
      } else {
        console.log('No personnel records found.');
      }
    } catch (error) {
      console.error('Error fetching random real time data:', error);
    }
  };


  // Image carousel logic for the ProfileCard.
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
    console.log("Fetching image for path:", imagePath); // Log the image path
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error fetching image from Firebase Storage:', error);
      return 'https://via.placeholder.com/300x300'; // fallback URL
    }
  };
  

  useEffect(() => {
    if (!fetchedOnceRef.current) {
      fetchPersonnelData();
      fetchRandomRealTimeData();
      fetchedOnceRef.current = true;
    }
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

          <OverviewCard title="Notification Status" description="Previous Notification for this Personnel">
          {analyticsData.personnelInfo ? (
            <>
              <p className="text-[26px] font-bold text-black">Name: {analyticsData.personnelInfo.personnelName}</p>
              <p className="text-[26px] font-semibold text-black">GearId: {analyticsData.personnelInfo.gearId}</p>
            </>
          ) : (
            <p className="text-[26px] font-semibold text-black">Loading...</p>
          )}
          </OverviewCard>

          {/* DashboardChart - Spanning columns 2 and 3 in Row 2 */}
          <div className="lg:col-span-2 max-w-[1150px]">
            <DashboardChart data={analyticsData.realTimeData}/>
          </div>
        </div>
      </BodyCard>
      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;
