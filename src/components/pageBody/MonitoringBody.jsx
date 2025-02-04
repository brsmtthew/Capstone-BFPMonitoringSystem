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
import { toast } from "react-toastify";

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
    addNotification,
    setNotificationFlag,
    getNotificationFlag,
  } = useStore();

  const { state } = useLocation(); // Access data passed via navigate

  const prevTemperature = useRef(null);
  const prevEnvTemperature = useRef(null);
  const prevSmokeSensor = useRef(null);
  const prevToxicGasSensor = useRef(null);
  const prevHeartRate = useRef(null);

  const [showTempNotification, setShowTempNotification] = useState(false);
  const [showEnvTempNotification, setShowEnvTempNotification] = useState(false);
  const [showSmokeNotification, setShowSmokeNotification] = useState(false);
  const [showToxicGasNotification, setShowToxicGasNotification] = useState(false);
  const [showHeartRateNotification, setShowHeartRateNotification] = useState(false);

  useEffect(() => {
    if (state?.selectedPersonnel) {
      addMonitoredPersonnel(state.selectedPersonnel);
      setSelectedPersonnel(state.selectedPersonnel);
    }
  }, [state, addMonitoredPersonnel, setSelectedPersonnel]);

  // Remove personnel handler
  const handleRemovePersonnel = (gearId) => {
    removeMonitoredPersonnel(gearId); // Use this to remove personnel from monitoring.
    setSelectedPersonnel(null); 
  };

  // Utility to fetch data from Firebase Realtime Database
  const fetchData = (path, gearId, sensorType) => {
    const dataRef = ref(realtimeDb, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.Reading !== undefined) {
        setSensorData(gearId, sensorType, data.Reading); // Use the specific property (e.g., Reading)
      } else {
        // Initialize with 0 if no data is available
        setSensorData(gearId, sensorType, 0);
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

      // Initialize sensor data with default values
      setSensorData(gearId, 'bodyTemperature', 0);
      setSensorData(gearId, 'environmentalTemperature', 0);
      setSensorData(gearId, 'smokeSensor', 0);
      setSensorData(gearId, 'ToxicGasSensor', 0);
      setSensorData(gearId, 'HeartRate', 0);

      // Fetch data for the selected personnel
      const unsubscribeTemp = fetchData(`Monitoring/${gearId}/BodyTemperature`, gearId, 'bodyTemperature');
      const unsubscribeEnvTemp = fetchData(`Monitoring/${gearId}/Environmental`, gearId, 'environmentalTemperature');
      const unsubscribeSmoke = fetchData(`Monitoring/${gearId}/SmokeSensor`, gearId, 'smokeSensor'); // Fetch SmokeSensor data
      const unsubscribeToxic = fetchData(`Monitoring/${gearId}/ToxicGasSensor`, gearId, 'ToxicGasSensor'); // Fetch ToxicGas data
      const unsubscribeHeartRate = fetchData(`Monitoring/${gearId}/HeartRate`, gearId, 'HeartRate'); // Fetch HeartRate data

      // Cleanup subscriptions when component unmounts or personnel changes
      return () => {
        unsubscribeTemp();
        unsubscribeEnvTemp();
        unsubscribeSmoke();
        unsubscribeToxic();
        unsubscribeHeartRate();
      };
    }
    // Cleanup all if no personnel is selected
    return () => {
      setSensorData({}); // Reset all sensor data
    };
  }, [selectedPersonnel, setSensorData]);

   // Notification utility to prevent repetitive code
   const handleSensorNotification = (sensor, sensorValue, criticalThreshold, normalThreshold, sensorName, sensorType, setNotificationState) => {
    const isCritical = sensorValue >= criticalThreshold;
    const isNormal = sensorValue <= normalThreshold;
    const hasSentNotification = getNotificationFlag(selectedPersonnel?.gearId, sensorType);
  
    // Check if the sensor value is a valid number
    const isValidValue = sensorValue !== undefined && sensorValue !== null;
  
    if (isValidValue) {
      if (isCritical && !hasSentNotification) {
        // Send the notification
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        addNotification({
          id: uniqueId,
          message: `Critical ${sensorName} Detected!`,
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: sensorName,
          value: sensorValue,
          isCritical: true,
        });
        toast.info(`🔥 Critical ${sensorName} Detected: ${sensorValue}`);
        setNotificationFlag(selectedPersonnel?.gearId, sensorType, true); // Mark as notified
      } else if (isNormal && hasSentNotification) {
        // Send a "back to normal" notification once it's back to safe levels
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        addNotification({
          id: uniqueId,
          message: `${sensorName} is back to normal.`,
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: sensorName,
          value: sensorValue,
          isCritical: false,
        });
        toast.info(`Normal ${sensorName} Detected: ${sensorValue}`);
        setNotificationFlag(selectedPersonnel?.gearId, sensorType, false); // Mark as normal
      }
    }
  };

  // Monitor different sensor changes
  useEffect(() => {
    if (selectedPersonnel?.gearId) {
      // Log each sensor value to verify it's being received
      console.log('Monitoring Sensors:', sensorData[selectedPersonnel?.gearId]);
      
      handleSensorNotification('Body Temperature', sensorData[selectedPersonnel?.gearId]?.bodyTemperature, 30, 25, 'Body Temperature', 'bodyTemperature', setShowTempNotification);
      handleSensorNotification('Environmental Temperature', sensorData[selectedPersonnel?.gearId]?.environmentalTemperature, 27, 22, 'Environmental Temperature', 'environmentalTemperature', setShowEnvTempNotification);
      handleSensorNotification('Smoke Level', sensorData[selectedPersonnel?.gearId]?.smokeSensor, 300, 200, 'Smoke Level', 'smokeSensor', setShowSmokeNotification);
      handleSensorNotification('Toxic Gas Level', sensorData[selectedPersonnel?.gearId]?.ToxicGasSensor, 250, 200, 'Toxic Gas Level', 'ToxicGasSensor', setShowToxicGasNotification);
      handleSensorNotification('Heart Rate', sensorData[selectedPersonnel?.gearId]?.HeartRate, 120, 80, 'Heart Rate', 'Heart Rate', setShowHeartRateNotification);

    }
  }, [sensorData, addNotification, selectedPersonnel, getNotificationFlag, addNotification]);

  const monitoringHealthData = (person) => [
    {
      icon: heartIcon,
      title: 'Heart Rate',
      value: sensorData[person.gearId]?.HeartRate !== undefined && sensorData[person.gearId].HeartRate !== 0
        ? `${sensorData[person.gearId].HeartRate.toFixed(2)} BPM`
        : (
          <span className='sm:text-[16px] md:text-[20px] lg:text-[32px]'>
            Waiting for data
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
            Waiting for data
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
            Waiting for data
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
            Waiting for data
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
            Waiting for data
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
          <p className="text-[24px] bg-bfpNavy px-6 py-2 text-white rounded-lg">
            Please go to the Personnel Page to monitor the personnel.
          </p>
      </div>
      
      ) : (
        <BodyCard className={`${monitoredPersonnel.length > 1 ? 'overflow-y-auto max-h-[80vh]' : ''}`}>
          {monitoredPersonnel.map((person) => (
            <div key={person.gearId} className="mb-6">
              {/* First Row: Profile Monitoring and Health Monitoring */}
              <div
                className="flex flex-col sm:items-center sm:justify-center md:items-center md:justify-center 
                          lg:flex-row lg:items-start lg:justify-start"
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
                className="flex flex-col sm:items-center sm:justify-center md:items-center md:justify-center 
                          lg:flex-row lg:items-start lg:justify-start"
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