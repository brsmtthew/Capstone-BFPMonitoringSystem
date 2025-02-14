import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, realtimeDb } from '../../firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import heartIcon from './dashboardAssets/heart-attack.png';
import enviTemp from './dashboardAssets/room-temperature.png';
import toxicSmoke from './dashboardAssets/toxic.png';
import danger from './dashboardAssets/danger.png';
import bodytem from './dashboardAssets/measure.png';
import maskIcon from './dashboardAssets/mask.png';
import warningIcon from './dashboardAssets/warning.png';
import flamesIcon from './dashboardAssets/flames.png';
import likeIcon from './dashboardAssets/like.png';
import HeaderSection from '../header/HeaderSection';
import ProfileMonitoring from '../MonitoringCards/ProfileMonitoring';
import MonitoringSection from '../MonitoringCards/MonitoringSection';
import BodyCard from '../parentCard/BodyCard';
import NotificationCard from '../MonitoringCards/NotificationCard';
import EnviMonitoring from '../MonitoringCards/EnviMonitoring';
import HealthMonitoring from '../MonitoringCards/HealthMonitoring';
import BatterIcon from './dashboardAssets/energy.png';
import BatteryHalf from './dashboardAssets/half-battery.png';
import LowBattery from './dashboardAssets/low-battery.png';
import lightingBattery from './dashboardAssets/lighting.png';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function MonitoringBody() {
  const {
    personnel,
    selectedPersonnel,
    monitoredPersonnel,
    addMonitoredPersonnel,
    removeMonitoredPersonnel,
    setPersonnel,
    setSelectedPersonnel,
    sensorData,
    setSensorData,
    handleSensorNotification
  } = useStore();

  const { state } = useLocation(); // Access data passed via navigate
  const unsubscribeMap = useRef({});
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    if (state?.selectedPersonnel) {
      addMonitoredPersonnel(state.selectedPersonnel);
      setSelectedPersonnel(state.selectedPersonnel);
    }
  }, [state, addMonitoredPersonnel, setSelectedPersonnel]);

  // Remove personnel handler
  const handleRemovePersonnel = (gearId) => {
    removeMonitoredPersonnel(gearId); 
    setSelectedPersonnel(null);
  
    // Stop listening to Firebase database updates
    if (unsubscribeMap.current[gearId]) {
      unsubscribeMap.current[gearId].forEach((unsubscribe) => unsubscribe());
      delete unsubscribeMap.current[gearId];
    }
  
    // Remove personnel's sensor data from state
    setSensorData((prev) => {
      const newData = { ...prev };
      delete newData[gearId];
      return newData;
    });
  };
  

  // Utility to fetch data from Firebase Realtime Database
  const fetchData = (path, gearId, sensorType) => {
    const dataRef = ref(realtimeDb, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (sensorType === "Battery" && data?.Percentage !== undefined) {
        setSensorData(gearId, sensorType, Number(data.Percentage));
      } else if (data?.Reading !== undefined) {
        setSensorData(gearId, sensorType, Number(data.Reading));
      }
    });
    return unsubscribe;
  };

  // Fetch personnel data from Firestore
  useEffect(() => {
    if (personnel.length === 0) {
      const unsubscribe = onSnapshot(collection(db, 'personnelInfo'), (querySnapshot) => {
        const personnelData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPersonnel(personnelData);
      });
      return () => unsubscribe();
    }
  }, [personnel, setPersonnel]);

  // Modified useEffect in MonitoringBody
  useEffect(() => {
    const currentMonitored = monitoredPersonnel.map(p => p.gearId);
    
    // Setup listeners for all monitored personnel
    monitoredPersonnel.forEach(person => {
      const gearId = person.gearId;
      
      if (!unsubscribeMap.current[gearId]) {
        const unsubs = [
          fetchData(`Monitoring/${gearId}/BodyTemperature`, gearId, 'bodyTemperature'),
          fetchData(`Monitoring/${gearId}/Environmental`, gearId, 'environmentalTemperature'),
          fetchData(`Monitoring/${gearId}/SmokeSensor`, gearId, 'smokeSensor'),
          fetchData(`Monitoring/${gearId}/ToxicGasSensor`, gearId, 'ToxicGasSensor'),
          fetchData(`Monitoring/${gearId}/HeartRate`, gearId, 'HeartRate'),
          fetchData(`Monitoring/${gearId}/Battery`, gearId, 'Battery')
        ];
        
        unsubscribeMap.current[gearId] = unsubs;
      }
    });

    // Cleanup for removed personnel
    Object.keys(unsubscribeMap.current).forEach(gearId => {
      if (!currentMonitored.includes(gearId)) {
        unsubscribeMap.current[gearId].forEach(unsubscribe => unsubscribe());
        delete unsubscribeMap.current[gearId];
      }
    });

    return () => {
      // Only clean up when component unmounts
    };
  }, [monitoredPersonnel, setSensorData]); // Now depends on monitoredPersonnel
    
  // Monitor different sensor changes
  useEffect(() => {
    monitoredPersonnel.forEach(person => {
      const gearId = person.gearId;
      const sensors = sensorData[gearId];
      if (!sensors) return;

      handleSensorNotification(gearId, sensors.bodyTemperature, 30, 25, 'Body Temperature', 'bodyTemperature');
      handleSensorNotification(gearId, sensors.environmentalTemperature, 33, 32.8, 'Environmental Temperature', 'environmentalTemperature');
      handleSensorNotification(gearId, sensors.smokeSensor, 450, 445, 'Smoke Level', 'smokeSensor');
      handleSensorNotification(gearId, sensors.ToxicGasSensor, 300, 280, 'Toxic Gas Level', 'ToxicGasSensor');
      handleSensorNotification(gearId, sensors.HeartRate, 120, 80, 'Heart Rate', 'HeartRate');
    })
  }, [sensorData, monitoredPersonnel, handleSensorNotification]);
  
  const monitoringHealthData = (person) => [
    {
      icon: BatterIcon,
      title: (
        <span className='sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]'>
          Battery Status
        </span>
      ),
      value: sensorData[person.gearId]?.Battery !== undefined && sensorData[person.gearId]?.Battery !== 0
        ? `${sensorData[person.gearId]?.Battery.toFixed(2)}%`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            No Data Available
          </span>
        ),
      description: sensorData[person.gearId]?.Battery >= 75 
        ? 'Battery is Full' 
        : sensorData[person.gearId]?.Battery >= 50 
          ? 'Battery is Medium' 
          : sensorData[person.gearId]?.Battery >= 25 
            ? 'Battery is Low' 
            : 'Critical Battery Level',
      warningIcon: sensorData[person.gearId]?.Battery >= 75 
        ? BatterIcon 
        : sensorData[person.gearId]?.Battery >= 50 
          ? BatteryHalf 
          : sensorData[person.gearId]?.Battery >= 25 
            ? LowBattery 
            : lightingBattery, // Critical battery icon
    },    
    {
      icon: heartIcon,
      title: (
        <span className='sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]'>
          Heart Rate
        </span>
      ),
      value: sensorData[person.gearId]?.HeartRate !== undefined && sensorData[person.gearId].HeartRate !== 0
        ? `${sensorData[person.gearId].HeartRate.toFixed(2)} BPM`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            No Data Available
          </span>
        ),
      description: sensorData[person.gearId]?.HeartRate >= 120 ? 'Elevated Heart Rate' : 'Normal Heart Rate',
      warningIcon: sensorData[person.gearId]?.HeartRate >= 120 ? flamesIcon : likeIcon,
    },
    {
      icon: bodytem,
      title: (
        <span className='sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]'>
          Body Temperature
        </span>
      ),
      value: sensorData[person.gearId]?.bodyTemperature !== undefined && sensorData[person.gearId].bodyTemperature !== 0
        ? `${sensorData[person.gearId].bodyTemperature.toFixed(2)}°C`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            No Data Available
          </span>
        ),
      description: sensorData[person.gearId]?.bodyTemperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: sensorData[person.gearId]?.bodyTemperature >= 40 ? flamesIcon : likeIcon,
    },
  ];
  
  const monitoringEnviData = (person) => [
    {
      icon: enviTemp,
      title: (
        <span className='sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]'>
          Environmental Temperature
        </span>
      ),
      value: sensorData[person.gearId]?.environmentalTemperature !== undefined && sensorData[person.gearId].environmentalTemperature !== 0
        ? `${sensorData[person.gearId].environmentalTemperature}°C`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            No Data Available
          </span>
        ),
      description: sensorData[person.gearId]?.environmentalTemperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: sensorData[person.gearId]?.environmentalTemperature >= 40 ? flamesIcon : likeIcon,
    },
    {
      icon: danger,
      title: (
        <span className='sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]'>
          CO-Gas
        </span>
      ),
      value: sensorData[person.gearId]?.ToxicGasSensor !== undefined && sensorData[person.gearId].ToxicGasSensor !== 0
        ? `${sensorData[person.gearId].ToxicGasSensor} PPM`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            No Data Available
          </span>
        ),
      description:
        sensorData[person.gearId]?.ToxicGasSensor >= 5
          ? 'Toxic Gas Detected'
          : 'No Toxic Gas Detected',
      warningIcon: sensorData[person.gearId]?.ToxicGasSensor >= 5 ? flamesIcon : likeIcon,
    },
    {
      icon: maskIcon,
      title: (
        <span className='sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]'>
          Smoke
        </span>
      ),
      value: sensorData[person.gearId]?.smokeSensor !== undefined && sensorData[person.gearId].smokeSensor !== 0
        ? `${sensorData[person.gearId].smokeSensor} PPM`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            No Data Available
          </span>
        ),
      description: sensorData[person.gearId]?.smokeSensor > 310 ? 'Critical Smoke Level' : 'Safe Level',
      warningIcon: sensorData[person.gearId]?.smokeSensor > 310 ? flamesIcon : likeIcon,
    },
  ];
  

  return (
    <div className="p-4 h-full flex flex-col bg-white">
      <HeaderSection title="REAL-TIME MONITORING" />
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />
      {monitoredPersonnel.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-[24px] bg-bfpNavy px-6 py-2 text-white rounded-lg cursor-pointer"
          onClick={() => navigate('/personnel')}>
             Click here to add personnel for monitoring.
          </p>
        </div>
      
      ) : (
        <BodyCard className={`${monitoredPersonnel.length > 1 ? 'overflow-y-auto max-h-[80vh]' : ''}`}>
          {monitoredPersonnel.map((person) => (
            <div key={person.gearId} className="mb-6">
              {/* First Row: Profile Monitoring and Health Monitoring */}
              <div
                className="flex flex-col sm:items-center md:items-center lg:items-center xl:flex-row xl:items-start xl:justify-start"
              >
                <div className="flex-shrink-0 mb-6">
                  <ProfileMonitoring 
                  key={person.gearId}
                  personnel={person} />
                </div>
                <div className="flex-grow mb-6 lg:ml-4">
                  <HealthMonitoring monitoringHealthData={monitoringHealthData(person)} />
                </div>
              </div>

              {/* Second Row: Notification Card and Environmental Monitoring */}
              <div
                className="flex flex-col sm:items-center md:items-center lg:items-center xl:flex-row xl:items-start xl:justify-start"
              >
                <div className="flex-shrink-0 mb-6">
                  <NotificationCard personnel={person} />
                </div>
                <div className="flex-grow mb-6 lg:ml-4">
                  <EnviMonitoring monitoringEnviData={monitoringEnviData(person)} />
                </div>
              </div>

              {/* Remove Button */}
              <div className="mt-4 flex justify-center">
                <button
                  className="mt-4 px-4 py-2 bg-red text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleRemovePersonnel(person.gearId)}
                >
                  Remove from Monitoring
                </button>
              </div>
            </div>
          ))}
        </BodyCard>
      )}
    </div>
  );
}

export default MonitoringBody;