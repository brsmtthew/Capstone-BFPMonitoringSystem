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
import MonitoringSection from '../monitoringCards/MonitoringSection';
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
    hasTempTimeout,
    setHasTempTimeout,
    hasEnvTempTimeout,
    setHasEnvTempTimeout,
    addNotification, // Add notification method from Zustand
  } = useStore();

  const prevTemperature = useRef(temperature);
  const prevEnvTemperature = useRef(environmentalTemperature);

  const [showTempNotification, setShowTempNotification] = useState(false);
  const [showEnvTempNotification, setShowEnvTempNotification] = useState(false);

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

  // Fetch body temperature
  // Fetch body temperature
useEffect(() => {
  if (selectedPersonnel?.gearId === 'pr001' && !temperature) {
    setIsLoadingBodyTemp(true);
    const tempRef = ref(realtimeDb, 'Temperature');
    const unsubscribeTemp = onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data);
        setLastUpdatedTemp(Date.now());
        setHasTempTimeout(false);
      }
      setIsLoadingBodyTemp(false);
    });
    return () => unsubscribeTemp();
  }
}, [selectedPersonnel, temperature, setTemperature, setIsLoadingBodyTemp, setLastUpdatedTemp, setHasTempTimeout]);

  // Fetch environmental temperature
  // Fetch environmental temperature
useEffect(() => {
  if (selectedPersonnel?.gearId === 'pr001' && !environmentalTemperature) {
    setIsLoadingEnvTemp(true);
    const envTempRef = ref(realtimeDb, 'EnvironmentalTemperature');
    const unsubscribeEnvTemp = onValue(envTempRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEnvironmentalTemperature(data);
        setLastUpdatedEnvTemp(Date.now());
        setHasEnvTempTimeout(false);
      }
      setIsLoadingEnvTemp(false);
    });
    return () => unsubscribeEnvTemp();
  }
}, [selectedPersonnel, environmentalTemperature, setEnvironmentalTemperature, setIsLoadingEnvTemp, setLastUpdatedEnvTemp, setHasEnvTempTimeout]);


  // Track body temperature changes
  useEffect(() => {
    if (temperature !== prevTemperature.current) {
      if (temperature >= 40) {
        setShowTempNotification(true);
        addNotification({
          message: 'Critical Body Temperature Detected!',
          timestamp: Date.now(),
        });
      } else {
        setShowTempNotification(false);
      }
      prevTemperature.current = temperature;
    }
  }, [temperature, addNotification]);

  // Track environmental temperature changes
  useEffect(() => {
    if (environmentalTemperature !== prevEnvTemperature.current) {
      if (environmentalTemperature >= 40) {
        setShowEnvTempNotification(true);
        addNotification({
          message: 'Critical Environmental Temperature Detected!',
          timestamp: Date.now(),
        });
      } else {
        setShowEnvTempNotification(false);
      }
      prevEnvTemperature.current = environmentalTemperature;
    }
  }, [environmentalTemperature, addNotification]);

  // Handle timeouts for body temperature and environmental temperature
  useEffect(() => {
    if (lastUpdatedTemp) {
      const timer = setTimeout(() => {
        if (Date.now() - lastUpdatedTemp > 10000) {
          setHasTempTimeout(true);
          addNotification({
            message: 'No body temperature data received within 30 seconds',
            timestamp: Date.now(),
          });
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedTemp, setHasTempTimeout, addNotification]);

  useEffect(() => {
    if (lastUpdatedEnvTemp) {
      const timer = setTimeout(() => {
        if (Date.now() - lastUpdatedEnvTemp > 10000) {
          setHasEnvTempTimeout(true);
          addNotification({
            message: 'No environmental temperature data received within 30 seconds',
            timestamp: Date.now(),
          });
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedEnvTemp, setHasEnvTempTimeout, addNotification]);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selected = personnel.find((p) => p.id === selectedId);
    setSelectedPersonnel(selected);
  
    // Clear temperature data when switching personnel
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
      value: isLoadingBodyTemp || hasTempTimeout
        ? 'Loading...'
        : temperature !== null
        ? `${temperature}°C`
        : 'No data available',
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
      value: isLoadingEnvTemp || hasEnvTempTimeout
        ? 'Loading...'
        : environmentalTemperature !== null
        ? `${environmentalTemperature}°C`
        : 'No data available',
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
