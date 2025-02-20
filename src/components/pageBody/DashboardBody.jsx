import React, { useState, useEffect, useRef } from 'react';
import AddPersonnelModal from '../modal/addPersonnelModal';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import HeaderSection from '../header/HeaderSection';
import OverviewCard from '../DashboardCard/OverViewCard';
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
        console.log('Fetched Notifications:', notificationsData);

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
    console.log("Fetching image for path:", imagePath);
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error fetching image from Firebase Storage:', error);
      return 'https://via.placeholder.com/300x300';
    }
  };

  // Helper function to compute alert severity ratio based on sensor data.
  const calculateAlertSeverityRatio = () => {
    const sensorTypes = [
      "Body Temperature",
      "Environmental Temperature",
      "Heart Rate",
      "Toxic Gas Level",
      "Smoke level"
    ];
    let severity = 0;
    sensorTypes.forEach((sensor) => {
      const sensorData = analyticsData.notifications.find((data) => data.sensor === sensor);
      if (sensorData && sensorData.isCritical) {
        severity += 20;
      }
    });
    return severity;
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

  // Sort notifications from latest to outdated
  const sortedNotifications = analyticsData.notifications.sort((a, b) => {
    const dateA = a.timestamp.seconds ? new Date(a.timestamp.seconds * 1000) : new Date(a.timestamp);
    const dateB = b.timestamp.seconds ? new Date(b.timestamp.seconds * 1000) : new Date(b.timestamp);
    return dateB - dateA;
  });  

  return (
    <div className="p-4 h-full flex flex-col bg-white font-montserrat">
      <HeaderSection title="DASHBOARD" />

      <div className="my-4 h-[3px] bg-separatorLine w-[80%] mx-auto" />

      {/* Parent Card */}
      <BodyCard>
        <div className="grid gap-4 sm:gap-6">
          {/* First row: Profile Card and Dashboard Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <ProfileCard
                name={personnel[currentImageIndex].name}
                position={personnel[currentImageIndex].position}
                image={personnel[currentImageIndex].image}
                onPrevious={prevImage}
                onNext={nextImage}
                fetchImageUrl={fetchImageUrl}
              />
            </div>
            <div className="lg:col-span-2">
              <DashboardChart 
                data={analyticsData.realTimeData}
                personnelInfo={analyticsData.personnelInfo}
              />
            </div>
          </div>

          {/* Second row: Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* First OverviewCard */}
            <OverviewCard
              title="Total Personnel"
              description="The total number of personnel currently registered."
            >
              <p className="text-[64px] font-bold text-black">{personnel.length}</p>
              <p className="text-[28px] font-bold text-black">Total Personnel</p>
            </OverviewCard>

            {/* Second OverviewCard */}
            <OverviewCard
              title="Notification Status"
              description="Previous Notifications for this Personnel"
            >
              <div className="max-h-64 overflow-y-auto text-center">
                {sortedNotifications && sortedNotifications.length > 0 ? (
                  sortedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-2 mb-2 rounded-lg lg:w-80 xl:w-96 ${
                        notification.isCritical
                          ? 'bg-red border border-red text-white'
                          : 'bg-green border border-green text-white'
                      }`}
                    >
                      <p className="text-lg font-semibold">{notification.message}</p>
                      <p className="text-lg font-bold">Value: {notification.value}</p>
                      <p className="text-sm">
                        {notification.timestamp ? (
                          notification.timestamp.seconds
                            ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                            : new Date(notification.timestamp).toLocaleString()
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[26px] font-semibold text-black">
                    No notifications available.
                  </p>
                )}
              </div>
            </OverviewCard>

            {/* Third OverviewCard */}
            {/* On small/medium screens, this card will span 2 columns */}
            <div className="sm:col-span-2 lg:col-span-1">
              <OverviewCard
                title="Alert Severity Ratio"
                description="Based on critical sensor readings (each sensor worth 20%)."
              >
                <p className="text-[64px] font-bold text-black">
                  {calculateAlertSeverityRatio()}%
                </p>
                <p className="text-[28px] font-bold text-black">Severity Ratio</p>
              </OverviewCard>
            </div>
          </div>
        </div>
      </BodyCard>
      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;
