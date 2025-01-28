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
  };

  // Utility to fetch data from Firebase Realtime Database
  const fetchData = (path, gearId, sensorType) => {
    const dataRef = ref(realtimeDb, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.Reading !== undefined) {
        setSensorData(gearId, sensorType, data.Reading); // Use the specific property (e.g., Reading)
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
  }, [selectedPersonnel, setSensorData]);

  // Monitor temperature changes and add notifications
  const tempNotificationSent = useRef(false);
  useEffect(() => {
    const temperature = sensorData[selectedPersonnel?.gearId]?.bodyTemperature;
    if (temperature !== prevTemperature.current) {
      const isCritical = temperature >= 40;
      setShowTempNotification(isCritical);
      if (isCritical && !tempNotificationSent.current && selectedPersonnel?.gearId) {
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: 'Critical Body Temperature Detected!',
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: 'Body Temperature',
          value: temperature,
        });
        tempNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        tempNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevTemperature.current = temperature;
    }
  }, [sensorData, addNotification, selectedPersonnel]);

  // Monitor environmental temperature changes and add notifications
  const envTempNotificationSent = useRef(false);
  useEffect(() => {
    const environmentalTemperature = sensorData[selectedPersonnel?.gearId]?.environmentalTemperature;
    if (environmentalTemperature !== prevEnvTemperature.current) {
      const isCritical = environmentalTemperature >= 40;
      setShowEnvTempNotification(isCritical);
      if (isCritical && !envTempNotificationSent.current && selectedPersonnel?.gearId) {
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: 'Critical Environmental Temperature Detected!',
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: 'Environmental Temperature',
          value: environmentalTemperature,
        });
        envTempNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        envTempNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevEnvTemperature.current = environmentalTemperature;
    }
  }, [sensorData, addNotification, selectedPersonnel]);

  // Monitor smoke sensor changes and add notifications
  const smokeNotificationSent = useRef(false);
  useEffect(() => {
    const smokeSensor = sensorData[selectedPersonnel?.gearId]?.smokeSensor;
    if (smokeSensor !== prevSmokeSensor.current) {
      const isCritical = smokeSensor >= 100 && smokeSensor <= 1000;
      setShowSmokeNotification(isCritical);
      if (isCritical && !smokeNotificationSent.current && selectedPersonnel?.gearId) {
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: 'High Smoke Level Detected!',
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: 'Smoke Sensor',
          value: smokeSensor,
        });
        smokeNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        smokeNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevSmokeSensor.current = smokeSensor;
    }
  }, [sensorData, addNotification, selectedPersonnel]);

  // Monitor toxic gas sensor changes and add notifications
  const toxicGasNotificationSent = useRef(false);
  useEffect(() => {
    const ToxicGasSensor = sensorData[selectedPersonnel?.gearId]?.ToxicGasSensor;
    if (ToxicGasSensor !== prevToxicGasSensor.current) {
      const isCritical = ToxicGasSensor >= 10 && ToxicGasSensor <= 10000;
      setShowToxicGasNotification(isCritical);
      if (isCritical && !toxicGasNotificationSent.current && selectedPersonnel?.gearId) {
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: 'High Carbon Monoxide Gas Detected!',
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: 'Toxic Gas Sensor',
          value: ToxicGasSensor,
        });
        toxicGasNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        toxicGasNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevToxicGasSensor.current = ToxicGasSensor;
    }
  }, [sensorData, addNotification, selectedPersonnel]);

  // Monitor heart rate changes and add notifications
  const heartRateNotificationSent = useRef(false);
  useEffect(() => {
    const HeartRate = sensorData[selectedPersonnel?.gearId]?.HeartRate;
    if (HeartRate !== prevHeartRate.current) {
      const isCritical = HeartRate >= 110 && HeartRate <= 200;
      setShowHeartRateNotification(isCritical);
      if (isCritical && !heartRateNotificationSent.current && selectedPersonnel?.gearId) {
        const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: 'High Heart Rate Detected!',
          timestamp: Date.now(),
          gearId: selectedPersonnel?.gearId,
          sensor: 'Heart Rate',
          value: HeartRate,
        });
        heartRateNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        heartRateNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevHeartRate.current = HeartRate;
    }
  }, [sensorData, addNotification, selectedPersonnel]);

  const monitoringHealthData = (person) => [
    {
      icon: heartIcon,
      title: 'Heart Rate',
      value: sensorData[person.gearId]?.HeartRate !== undefined
        ? `${sensorData[person.gearId].HeartRate.toFixed(2)} BPM`
        : 'No data available',
      description: sensorData[person.gearId]?.HeartRate >= 120 ? 'Elevated Heart Rate' : 'Normal Heart Rate',
      warningIcon: sensorData[person.gearId]?.HeartRate >= 120 ? flamesIcon : likeIcon,
    },
    {
      icon: bodytem,
      title: 'Body Temperature',
      value: sensorData[person.gearId]?.bodyTemperature !== undefined
        ? `${sensorData[person.gearId].bodyTemperature.toFixed(2)}°C`
        : 'No data available',
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
      value: sensorData[person.gearId]?.environmentalTemperature !== undefined
        ? `${sensorData[person.gearId].environmentalTemperature}°C`
        : 'No data available',
      description: sensorData[person.gearId]?.environmentalTemperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: sensorData[person.gearId]?.environmentalTemperature >= 40 ? flamesIcon : likeIcon,
    },
    {
      icon: danger,
      title: 'Toxic Gas',
      value: sensorData[person.gearId]?.ToxicGasSensor !== undefined
        ? `${sensorData[person.gearId].ToxicGasSensor} PPM`
        : 'No data available',
      description:
        sensorData[person.gearId]?.ToxicGasSensor >= 5
          ? 'Toxic Gas Detected'
          : 'No Toxic Gas Detected',
      warningIcon: sensorData[person.gearId]?.ToxicGasSensor >= 5 ? flamesIcon : likeIcon,
    },
    {
      icon: maskIcon,
      title: 'Smoke',
      value: sensorData[person.gearId]?.smokeSensor !== undefined
        ? `${sensorData[person.gearId].smokeSensor} PPM`
        : 'No data available',
      description: sensorData[person.gearId]?.smokeSensor > 500 ? 'Critical Smoke Level' : 'Safe Level',
      warningIcon: sensorData[person.gearId]?.smokeSensor > 500 ? flamesIcon : likeIcon,
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