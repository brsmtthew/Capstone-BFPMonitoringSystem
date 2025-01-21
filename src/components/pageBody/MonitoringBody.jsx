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
    temperature,
    setTemperature,
    environmentalTemperature,
    setEnvironmentalTemperature,
    addNotification,
    smokeSensor,
    setSmokeSensor,
    ToxicGasSensor,
    setToxicGasSensor,
    HeartRate,
    setHeartRate,
  } = useStore();

  const { state } = useLocation(); // Access data passed via navigate

  const prevTemperature = useRef(temperature);
  const prevEnvTemperature = useRef(environmentalTemperature);
  const prevSmokeSensor = useRef(smokeSensor);
  const prevToxicGasSensor = useRef(ToxicGasSensor);
  const prevHeartRate = useRef(HeartRate);

  const [showTempNotification, setShowTempNotification] = useState(false);
  const [showEnvTempNotification, setShowEnvTempNotification] = useState(false);
  const [showSmokeNotification, setShowSmokeNotification] = useState(false);
  const [showToxicGasNotification, setShowToxicGasNotification] = useState(false);
  const [showHeartRateNotification, setShowHeartRateNotification] = useState(false);

  const uniqueId = `${selectedPersonnel?.gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


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
  const fetchData = (path, setter, property) => {
    const dataRef = ref(realtimeDb, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data[property] !== undefined) {
        setter(data[property]); // Use the specific property (e.g., Reading)
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
      const unsubscribeTemp = fetchData(`Monitoring/${gearId}/BodyTemperature`, setTemperature, 'Reading');
      const unsubscribeEnvTemp = fetchData(`Monitoring/${gearId}/Environmental`, setEnvironmentalTemperature, 'Reading');
      const unsubscribeSmoke = fetchData(`Monitoring/${gearId}/SmokeSensor`, setSmokeSensor, 'Reading'); // Fetch SmokeSensor data
      const unsubscribeToxic = fetchData(`Monitoring/${gearId}/ToxicGasSensor`, setToxicGasSensor, 'Reading'); // Fetch ToxicGas data
      const unsubscribeHeartRate = fetchData(`Monitoring/${gearId}/HeartRate`, setHeartRate, 'Reading'); // Fetch HeartRate data

      // Cleanup subscriptions when component unmounts or personnel changes
      return () => {
        unsubscribeTemp();
        unsubscribeEnvTemp();
        unsubscribeSmoke();
        unsubscribeToxic();
        unsubscribeHeartRate();
      };
    }
  }, [selectedPersonnel, setTemperature, setEnvironmentalTemperature, setSmokeSensor, setToxicGasSensor, setHeartRate]);

  // Monitor temperature changes and add notifications
  const tempNotificationSent = useRef(false);
  useEffect(() => {
    if (temperature !== prevTemperature.current) {
      const isCritical = temperature >= 40;
      setShowTempNotification(isCritical);
      if (isCritical && !tempNotificationSent.current && selectedPersonnel?.gearId) {
        //check if notification is for the currently selected personnel
        if (selectedPersonnel.gearId === selectedPersonnel?.gearId) {
          addNotification({
            id: uniqueId,
            message: 'Critical Body Temperature Detected!',
            timestamp: Date.now(),
            gearId: selectedPersonnel?.gearId,
            sensor: 'Body Temperature',
            value: temperature,
          });
        }
        tempNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        tempNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevTemperature.current = temperature;
    }
  }, [temperature, addNotification, selectedPersonnel]);

  // Monitor environmental temperature changes and add notifications
  const envTempNotificationSent = useRef(false);
  useEffect(() => {
    if (environmentalTemperature !== prevEnvTemperature.current) {
      const isCritical = environmentalTemperature >= 40;
      setShowEnvTempNotification(isCritical);
      if (isCritical && !envTempNotificationSent.current && selectedPersonnel?.gearId) {
        //check if notification is for the currently selected personnel
        if (selectedPersonnel.gearId === selectedPersonnel?.gearId) {
          addNotification({
            id: uniqueId,
            message: 'Critical Environmental Temperature Detected!',
            timestamp: Date.now(),
            gearId: selectedPersonnel?.gearId,
            sensor: 'Environmental Temperature',
            value: environmentalTemperature,
          });
        }
        envTempNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        envTempNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevEnvTemperature.current = environmentalTemperature;
    }
  }, [environmentalTemperature, addNotification, selectedPersonnel]);

  // Monitor smoke sensor changes and add notifications
  const smokeNotificationSent = useRef(false);
  useEffect(() => {
    if (smokeSensor !== prevSmokeSensor.current) {
      const isCritical = smokeSensor >= 100 && smokeSensor <= 1000;
      setShowSmokeNotification(isCritical);
      if (isCritical && !smokeNotificationSent.current && selectedPersonnel?.gearId) {
        //check if notification is for the currently selected personnel
        if (selectedPersonnel.gearId === selectedPersonnel?.gearId) {
          addNotification({
            id: uniqueId,
            message: 'High Smoke Level Detected!',
            timestamp: Date.now(),
            gearId: selectedPersonnel?.gearId,
            sensor: 'Smoke Sensor',
            value: smokeSensor,
          });
        }
        smokeNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        smokeNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevSmokeSensor.current = smokeSensor;
    }
  }, [smokeSensor, addNotification, selectedPersonnel]);

  // Monitor toxic gas sensor changes and add notifications
  const toxicGasNotificationSent = useRef(false);
  useEffect(() => {
    if (ToxicGasSensor !== prevToxicGasSensor.current) {
      const isCritical = ToxicGasSensor >= 10 && ToxicGasSensor <= 10000;
      setShowToxicGasNotification(isCritical);
      if (isCritical && !toxicGasNotificationSent.current && selectedPersonnel?.gearId) {
        //check if notification is for the currently selected personnel
        if (selectedPersonnel.gearId === selectedPersonnel?.gearId) {
          addNotification({
            id: uniqueId,
            message: 'High Carbon Monoxide Gas Detected!',
            timestamp: Date.now(),
            gearId: selectedPersonnel?.gearId,
            sensor: 'Toxic Gas Sensor',
            value: ToxicGasSensor,
          });
        }
        toxicGasNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        toxicGasNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevToxicGasSensor.current = ToxicGasSensor;
    }
  }, [ToxicGasSensor, addNotification, selectedPersonnel]);

  // Monitor heart rate changes and add notifications
  const heartRateNotificationSent = useRef(false);
  useEffect(() => {
    if (HeartRate !== prevHeartRate.current) {
      const isCritical = HeartRate >= 110 && HeartRate <= 200;
      setShowHeartRateNotification(isCritical);
      if (isCritical && !heartRateNotificationSent.current && selectedPersonnel?.gearId) {
        //check if notification is for the currently selected personnel
        if (selectedPersonnel.gearId === selectedPersonnel?.gearId) {
          addNotification({
            id: uniqueId,
            message: 'High Heart Rate Detected!',
            timestamp: Date.now(),
            gearId: selectedPersonnel?.gearId,
            sensor: 'Heart Rate',
            value: HeartRate,
          });
        }
        heartRateNotificationSent.current = true; // Set the flag to true after sending the notification
      } else if (!isCritical) {
        heartRateNotificationSent.current = false; // Reset the flag if the value is no longer critical
      }
      prevHeartRate.current = HeartRate;
    }
  }, [HeartRate, addNotification, selectedPersonnel]);

  const monitoringHealthData = (person) => [
    {
      icon: heartIcon,
      title: 'Heart Rate',
      value: person.gearId === selectedPersonnel?.gearId
        ? HeartRate !== null
          ? `${HeartRate.toFixed(2)} BPM`
          : 'No data available'
        : 'No data available',
      description: HeartRate >= 120 ? 'Elevated Heart Rate' : 'Normal Heart Rate',
      warningIcon: HeartRate >= 120 ? flamesIcon : likeIcon,
    },
    {
      icon: bodytem,
      title: 'Body Temperature',
      value: person.gearId === selectedPersonnel?.gearId
        ? temperature !== null
          ? `${temperature.toFixed(2)}°C`
          : 'No data available'
        : 'No data available',
      description: temperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: temperature >= 40 ? flamesIcon : likeIcon,
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
      value: person.gearId === selectedPersonnel?.gearId
        ? environmentalTemperature !== null
          ? `${environmentalTemperature}°C`
          : 'No data available'
        : 'No data available',
      description: environmentalTemperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: environmentalTemperature >= 40 ? flamesIcon : likeIcon,
    },
    {
      icon: danger,
      title: 'Toxic Gas',
      value: person.gearId === selectedPersonnel?.gearId
        ? ToxicGasSensor !== null && ToxicGasSensor !== undefined
          ? `${ToxicGasSensor} PPM`
          : 'No data available'
        : 'No data available',
      description:
        ToxicGasSensor >= 5
          ? 'Toxic Gas Detected'
          : 'No Toxic Gas Detected',
      warningIcon: ToxicGasSensor >= 5 ? flamesIcon : likeIcon,
    },
    {
      icon: maskIcon,
      title: 'Smoke',
      value: person.gearId === selectedPersonnel?.gearId
        ? smokeSensor !== null
          ? `${smokeSensor} PPM`
          : 'No data available'
        : 'No data available',
      description: smokeSensor > 500 ? 'Critical Smoke Level' : 'Safe Level',
      warningIcon: smokeSensor > 500 ? flamesIcon : likeIcon,
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
              <div className="flex">
                <div className="flex-shrink-0 mb-6">
                  <ProfileMonitoring personnel={person} />
                </div>
                <div className="flex-grow mb-6 ml-4">
                  <HealthMonitoring monitoringHealthData={monitoringHealthData(person)} />
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mb-6">
                  <NotificationCard personnel={person} />
                </div>
                <div className="flex-grow mb-6 ml-4">
                  <EnviMonitoring monitoringEnviData={monitoringEnviData(person)} />
                </div>
              </div>
              <div className="mt-4">
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