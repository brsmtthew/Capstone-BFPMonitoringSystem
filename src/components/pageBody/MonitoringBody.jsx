import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, realtimeDb } from '../../firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import heartIcon from './dashboardAssets/heart-attack.png';
import enviTemp from './dashboardAssets/room-temperature.png';
import toxicSmoke from './dashboardAssets/mask.png';
import bodytem from './dashboardAssets/measure.png';
import warningIcon from './dashboardAssets/warning.png';
import flamesIcon from './dashboardAssets/flames.png';
import likeIcon from './dashboardAssets/like.png';
import HeaderSection from '../header/HeaderSection';
import ProfileMonitoring from '../MonitoringCards/ProfileMonitoring';
import MonitoringSection from '../MonitoringCards/MonitoringSection';
import BodyCard from '../parentCard/BodyCard';
import NotificationCard from '../MonitoringCards/NotificationCard';

function MonitoringBody() {
  const {
    personnel,
    selectedPersonnel,
    setPersonnel,
    setSelectedPersonnel,
    temperature,
    setTemperature,
    environmentalTemperature,
    setEnvironmentalTemperature,
    isLoadingBodyTemp,
    setIsLoadingBodyTemp,
    isLoadingEnvTemp,
    setIsLoadingEnvTemp,
    lastUpdatedTemp,
    setLastUpdatedTemp,
    lastUpdatedEnvTemp,
    setLastUpdatedEnvTemp,
    addNotification,
    startGlobalTimeout,
    hasTempTimeout,
    setHasTempTimeout,
    hasEnvTempTimeout,
    setHasEnvTempTimeout,
  } = useStore();

  const prevTemperature = useRef(temperature);
  const prevEnvTemperature = useRef(environmentalTemperature);

  const [showTempNotification, setShowTempNotification] = useState(false);
  const [showEnvTempNotification, setShowEnvTempNotification] = useState(false);

  // Utility to fetch data from Firebase Realtime Database
  const fetchData = (path, setter, loadingSetter, lastUpdatedSetter, timeoutSetter) => {
    loadingSetter(true);
    const dataRef = ref(realtimeDb, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setter(data);
        lastUpdatedSetter(Date.now());
        timeoutSetter(false);
      }
      loadingSetter(false);
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

  // Fetch body temperature data
  useEffect(() => {
    if (selectedPersonnel?.gearId === 'pr001' && !temperature) {
      const unsubscribe = fetchData(
        'Temperature',
        setTemperature,
        setIsLoadingBodyTemp,
        setLastUpdatedTemp,
        setHasTempTimeout
      );
      return () => unsubscribe();
    }
  }, [selectedPersonnel, temperature, setTemperature, setIsLoadingBodyTemp, setLastUpdatedTemp, setHasTempTimeout]);

  // Fetch environmental temperature data
  useEffect(() => {
    if (selectedPersonnel?.gearId === 'pr001' && !environmentalTemperature) {
      const unsubscribe = fetchData(
        'EnvironmentalTemperature',
        setEnvironmentalTemperature,
        setIsLoadingEnvTemp,
        setLastUpdatedEnvTemp,
        setHasEnvTempTimeout
      );
      return () => unsubscribe();
    }
  }, [selectedPersonnel, environmentalTemperature, setEnvironmentalTemperature, setIsLoadingEnvTemp, setLastUpdatedEnvTemp, setHasEnvTempTimeout]);

  // Monitor temperature changes and add notifications
  useEffect(() => {
    if (temperature !== prevTemperature.current) {
      const isCritical = temperature >= 40;
      setShowTempNotification(isCritical);
      if (isCritical) {
        addNotification({ message: 'Critical Body Temperature Detected!', timestamp: Date.now(), gearId: selectedPersonnel.gearId, sensor: 'Body Temperature', value: temperature });
      }
      prevTemperature.current = temperature;
    }
  }, [temperature, addNotification, selectedPersonnel]);

  // Monitor environmental temperature changes and add notifications
  useEffect(() => {
    if (environmentalTemperature !== prevEnvTemperature.current) {
      const isCritical = environmentalTemperature >= 40;
      setShowEnvTempNotification(isCritical);
      if (isCritical) {
        addNotification({ message: 'Critical Environmental Temperature Detected!', timestamp: Date.now(), gearId: selectedPersonnel.gearId, sensor: 'Environmental Temperature', value: environmentalTemperature});
      }
      prevEnvTemperature.current = environmentalTemperature;
    }
  }, [environmentalTemperature, addNotification, selectedPersonnel]);

  // Timeout handlers for temperature data
  useEffect(() => {
    if (lastUpdatedTemp) {
      if (!hasTempTimeout && !useStore.getState().isTimeoutActive(true)) {
        startGlobalTimeout(() => {
          if (Date.now() - lastUpdatedTemp > 10000) {
            setHasTempTimeout(true);
            addNotification({ message: 'No body temperature data received within 30 seconds', timestamp: Date.now(),gearId: selectedPersonnel?.gearId,saved: false, sensor: 'Body Temperature'});
          }
        }, 10000, true);
      }
    }
  }, [lastUpdatedTemp, hasTempTimeout, addNotification, startGlobalTimeout]);
  

  useEffect(() => {
    if (lastUpdatedEnvTemp) {
      if (!hasEnvTempTimeout && !useStore.getState().isTimeoutActive(false)) {
        startGlobalTimeout(() => {
          if (Date.now() - lastUpdatedEnvTemp > 10000) {
            setHasEnvTempTimeout(true);
            addNotification({ message: 'No environmental temperature data received within 30 seconds', timestamp: Date.now(), gearId: selectedPersonnel?.gearId,saved: false, sensor: 'environmental Temperature'});
          }
        }, 10000, false);
      }
    }
  }, [lastUpdatedEnvTemp, hasEnvTempTimeout, addNotification, startGlobalTimeout]);
  
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selected = personnel.find((p) => p.id === selectedId);
    setSelectedPersonnel(selected);

    // Reset temperature data when switching personnel
    if (selectedId !== 'pr001') {
      setTemperature(null);
      setEnvironmentalTemperature(null);
    }
  };

  const healthMonitoringData = [
    {
      icon: heartIcon,
      title: 'Heart Rate',
      value: '120 BPM',
      description: 'Elevated Heart Rate',
      warningIcon: warningIcon,
    },
    {
      icon: bodytem,
      title: 'Body Temperature',
      value: selectedPersonnel?.gearId === 'pr001'  // Only show "Loading..." for pr001
        ? (isLoadingBodyTemp || hasTempTimeout ? 'Loading...' : temperature !== null ? `${temperature}°C` : 'No data available')
        : 'No data available',  // Show "No data available" for others like pr002, pr003
      description: temperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: temperature >= 40 ? flamesIcon : likeIcon,
    },
  ];

  const environmentalMonitoringData = [
    {
      icon: toxicSmoke,
      title: 'Toxic Gas',
      value: '5 PPM',
      description: 'Optimal Range',
      warningIcon: likeIcon,
    },
    {
      icon: toxicSmoke,
      title: 'Smoke',
      value: '100 PPM',
      description: 'Safe Level',
      warningIcon: likeIcon,
    },
    {
      icon: enviTemp,
      title: 'Environmental Temp',
      value: selectedPersonnel?.gearId === 'pr001'  // Only show "Loading..." for pr001
        ? (isLoadingEnvTemp || hasEnvTempTimeout ? 'Loading...' : environmentalTemperature !== null ? `${environmentalTemperature}°C` : 'No data available')
        : 'No data available',  // Show "No data available" for others like pr002, pr003
      description: environmentalTemperature >= 40 ? 'Critical Temperature' : 'Normal Temperature',
      warningIcon: environmentalTemperature >= 40 ? flamesIcon : likeIcon,
    },
  ];

  return (
    <div className="p-4 h-full flex flex-col bg-white">
      <HeaderSection
        title="REAL-TIME MONITORING"
        extraContent={
          <select
            className="text-xl text-white bg-bfpNavy font-semibold border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleSelectChange}
          >
            <option value="">Select Personnel</option>
            {personnel.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        }
      />
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />
      <BodyCard>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 text-white h-full pb-2">
          <div className="lg:col-span-1 flex flex-col justify-start gap-4">
            <ProfileMonitoring personnel={selectedPersonnel} />
            <NotificationCard />
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <MonitoringSection title="Health Monitoring Section" monitoringData={healthMonitoringData} />
            <MonitoringSection title="Environmental Monitoring Section" monitoringData={environmentalMonitoringData} gridCols={3} />
          </div>
        </div>
      </BodyCard>
    </div>
  );
}

export default MonitoringBody;
