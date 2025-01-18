import React, { useEffect, useState } from 'react';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';
import BodyChart from '../chart/HealthChartSection';
import EnvironmentChartSection from '../chart/EnvironmentChartSection';
import { db } from "../../firebase/Firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const AnalyticsBody = () => {
  const [realTimeData, setRealTimeData] = useState([]);
  
  // Function to fetch data
  const fetchRealTimeData = async () => {
    try {
      // Step 1: Get all documents from the personnelRecords collection
      const personnelRecordsRef = collection(db, 'personnelRecords');
      const querySnapshot = await getDocs(personnelRecordsRef);
      
      // Step 2: Loop through the documents and fetch their real-time data (which is a collection)
      const data = [];
      for (const docSnapshot of querySnapshot.docs) {
        const realTimeDataRef = collection(doc(db, 'personnelRecords', docSnapshot.id), 'realTimeData');
        const realTimeDocSnapshot = await getDocs(realTimeDataRef);
        
        realTimeDocSnapshot.forEach((realTimeDoc) => {
          data.push({
            ...realTimeDoc.data(),
            id: realTimeDoc.id,
            personnelId: docSnapshot.id,
          });
        });
      }
      
      setRealTimeData(data);
    } catch (error) {
      console.error("Error fetching real-time data: ", error);
    }
  };

  // Fetch real-time data on component mount
  useEffect(() => {
    fetchRealTimeData();
  }, []);

  // Extract smoke sensor data from realTimeData
  const smokeData = realTimeData
    .filter((data) => data.smokeSensor) // Filter data that has smokeSensor
    .map((data) => ({
      time: data.time, // Assuming there's a timestamp field
      value: data.smokeSensor, // Extract smoke sensor value
    }));

    const EnviData = realTimeData
    .filter((data) => data.environmentalTemperature) // Filter data that has environmentalTemperature
    .map((data) => ({
      time: data.time, // Assuming there's a timestamp field
      value: data.environmentalTemperature, // Extract environmental temperature value
    }));

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      {/* Header Section */}
      <HeaderSection title="ANALYTICS OVERVIEW" />

      {/* Separator */}
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Grid for Analytics Data */}
      <BodyCard>
        {/* Add a bottom margin to HealthChartSection */}
        <div className="mb-6">
          <BodyChart data={realTimeData} />
        </div>
        <EnvironmentChartSection smokeData={smokeData} enviData={EnviData} />
      </BodyCard>
    </div>
  );
};

export default AnalyticsBody;
