// Updated MonitoringBody.js
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, realtimeDb } from '../../firebase/Firebase'; // Import Firestore and Realtime DB
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database imports
import heartIcon from "./dashboardAssets/heart-attack.png";
import enviTemp from "./dashboardAssets/room-temperature.png";
import toxicSmoke from "./dashboardAssets/mask.png";
import bodytem from "./dashboardAssets/measure.png";
import warningIcon from "./dashboardAssets/warning.png";
import flamesIcon from "./dashboardAssets/flames.png";
import likeIcon from "./dashboardAssets/like.png";
import HeaderSection from '../header/HeaderSection';
import ProfileMonitoring from '../MonitoringCards/ProfileMonitoring';
import MonitoringSection from '../MonitoringCards/MonitoringSection';
import Question from '../pageBody/dashboardAssets/question-mark.png'

function MonitoringBody() {
  const [personnel, setPersonnel] = useState([]); // Firestore data
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [temperature, setTemperature] = useState(null); // Real-time temperature data
  const [environmentalTemperature, setEnvironmentalTemperature] = useState(null); // Real-time environmental data
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedTemp, setLastUpdatedTemp] = useState(null);
  const [hasTempTimeout, setHasTempTimeout] = useState(false);

  const [lastUpdatedEnvTemp, setLastUpdatedEnvTemp] = useState(null);
  const [hasEnvTempTimeout, setHasEnvTempTimeout] = useState(false);

  // Fetch personnel data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'personnelInfo'), (querySnapshot) => {
      const personnelData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersonnel(personnelData);
    });
    return () => unsubscribe();
  }, []);

  // Fetch body temperature from Realtime Database
  useEffect(() => {
    const tempRef = ref(realtimeDb, 'Temperature');
    const unsubscribeTemp = onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data);
        setLastUpdatedTemp(Date.now());
        setHasTempTimeout(false);
      } else {
        setTemperature(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribeTemp();
  }, []);

  // Fetch environmental temperature from Realtime Database
  useEffect(() => {
    const envTempRef = ref(realtimeDb, 'EnvironmentalTemperature');
    const unsubscribeEnvTemp = onValue(envTempRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEnvironmentalTemperature(data);
        setLastUpdatedEnvTemp(Date.now());
        setHasEnvTempTimeout(false);
      } else {
        setEnvironmentalTemperature(null);
      }
    });
    return () => unsubscribeEnvTemp();
  }, []);

  // Handle body temperature timeout
  useEffect(() => {
    if (lastUpdatedTemp) {
      const timer = setInterval(() => {
        if (Date.now() - lastUpdatedTemp > 30000) {
          setHasTempTimeout(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lastUpdatedTemp]);

  // Handle environmental temperature timeout
  useEffect(() => {
    if (lastUpdatedEnvTemp) {
      const timer = setInterval(() => {
        if (Date.now() - lastUpdatedEnvTemp > 30000) {
          setHasEnvTempTimeout(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lastUpdatedEnvTemp]);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selected = personnel.find((p) => p.id === selectedId);
    setSelectedPersonnel(selected);
  };

  const healthMonitoringData = [
    {
      icon: heartIcon,
      title: "Heart Rate",
      value: "120 BPM",
      description: "Elevated Heart Rate",
      warningIcon: warningIcon,
    },
    {
      icon: bodytem,
      title: "Body Temperature",
      value: isLoading
        ? "Loading..."
        : hasTempTimeout
        ? "No current data"
        : temperature
        ? `${temperature}°C`
        : "No data available",
      description: hasTempTimeout
        ? "Data timeout"
        : temperature >= 40
        ? "Critical Temperature"
        : "Normal Temperature",
      warningIcon: temperature >= 40 ? flamesIcon : likeIcon,
    },
  ];

  const environmentalMonitoringData = [
    {
      icon: toxicSmoke,
      title: "Toxic Gas",
      value: "5 PPM",
      description: "Optimal Range",
      warningIcon: likeIcon,
    },
    {
      icon: toxicSmoke,
      title: "Smoke",
      value: "100 PPM",
      description: "Safe Level",
      warningIcon: likeIcon,
    },
    {
      icon: enviTemp,
      title: "Environmental Temp",
      value: hasEnvTempTimeout
        ? "No current data"
        : environmentalTemperature
        ? `${environmentalTemperature}°C`
        : "No data available",
      description: hasEnvTempTimeout
        ? "Data timeout"
        : environmentalTemperature >= 40
        ? "Critical Temperature"
        : "Normal Temperature",
      warningIcon: environmentalTemperature >= 40 ? flamesIcon : likeIcon,
    },
  ];

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-white min-h-full pb-2">
        <div className="lg:col-span-1 flex flex-col justify-center">
          <ProfileMonitoring personnel={selectedPersonnel} />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <MonitoringSection
            title="Health Monitoring Section"
            monitoringData={healthMonitoringData}
          />

          <MonitoringSection
            title="Environmental Monitoring Section"
            monitoringData={environmentalMonitoringData}
            gridCols={3}
          />
        </div>
      </div>
    </div>
  );
}

export default MonitoringBody;
