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

  useEffect(() => {
    if (selectedPersonnel?.gearId) {
      const gearId = selectedPersonnel.gearId;
  
      // Fetch sensor data
      const unsubscribeTemp = fetchData(`Monitoring/${gearId}/BodyTemperature`, gearId, 'bodyTemperature');
      const unsubscribeEnvTemp = fetchData(`Monitoring/${gearId}/Environmental`, gearId, 'environmentalTemperature');
      const unsubscribeSmoke = fetchData(`Monitoring/${gearId}/SmokeSensor`, gearId, 'smokeSensor');
      const unsubscribeToxic = fetchData(`Monitoring/${gearId}/ToxicGasSensor`, gearId, 'ToxicGasSensor');
      const unsubscribeHeartRate = fetchData(`Monitoring/${gearId}/HeartRate`, gearId, 'HeartRate');
      const unsubscribeBattery = fetchData(`Monitoring/${gearId}/Battery`, gearId, 'Battery');
  
      // Store unsubscribe functions
      unsubscribeMap.current[gearId] = [
        unsubscribeTemp, 
        unsubscribeEnvTemp, 
        unsubscribeSmoke, 
        unsubscribeToxic, 
        unsubscribeHeartRate,
        unsubscribeBattery
      ];
  
      return () => {
        if (unsubscribeMap.current[gearId]) {
          unsubscribeMap.current[gearId].forEach((unsubscribe) => unsubscribe());
          delete unsubscribeMap.current[gearId];
        }
      };
    }
  }, [selectedPersonnel, setSensorData]);
  
  // Monitor different sensor changes
  useEffect(() => {
    if (selectedPersonnel?.gearId) {
      const gearId = selectedPersonnel.gearId;
      const sensors = sensorData[gearId];
  
      if (!sensors) return;
  
      handleSensorNotification(gearId, sensors.bodyTemperature, 30, 25, 'Body Temperature', 'bodyTemperature');
      handleSensorNotification(gearId, sensors.environmentalTemperature, 30, 28, 'Environmental Temperature', 'environmentalTemperature');
      handleSensorNotification(gearId, sensors.smokeSensor, 470, 460, 'Smoke Level', 'smokeSensor');
      handleSensorNotification(gearId, sensors.ToxicGasSensor, 390, 380, 'Toxic Gas Level', 'ToxicGasSensor');
      handleSensorNotification(gearId, sensors.HeartRate, 120, 80, 'Heart Rate', 'HeartRate');
  
    }
  }, [sensorData[selectedPersonnel?.gearId], selectedPersonnel, handleSensorNotification]);
  
  const monitoringHealthData = (person) => [
    {
      icon: BatterIcon,
      title: 'Battery Percentage',
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
      title: 'Heart Rate',
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
      title: 'Body Temperature',
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
        <span className='text-[16px]'>
          Envi Temperature
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
      title: 'Toxic Gas',
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
      title: 'Smoke',
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
            Click here to go to the Personnel Page for monitoring.
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
                  <ProfileMonitoring personnel={person} />
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