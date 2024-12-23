import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, realtimeDb } from '../../firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import heartIcon from "./dashboardAssets/heart-attack.png";
import enviTemp from "./dashboardAssets/room-temperature.png";
import toxicSmoke from "./dashboardAssets/mask.png";
import bodytem from "./dashboardAssets/measure.png";
import warningIcon from "./dashboardAssets/warning.png";
import flamesIcon from "./dashboardAssets/flames.png";
import likeIcon from "./dashboardAssets/like.png";
import HeaderSection from '../header/HeaderSection';
import ProfileMonitoring from '../MonitoringCards/ProfileMonitoring';
import MonitoringSection from '../monitoringCards/MonitoringSection';
import BodyCard from '../parentCard/BodyCard';
import NotificationCard from '../MonitoringCards/NotificationCard';

function MonitoringBody() {
  const [personnel, setPersonnel] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [environmentalTemperature, setEnvironmentalTemperature] = useState(null);
  const [isLoadingBodyTemp, setIsLoadingBodyTemp] = useState(true);
  const [isLoadingEnvTemp, setIsLoadingEnvTemp] = useState(true);
  const [lastUpdatedTemp, setLastUpdatedTemp] = useState(null);
  const [lastUpdatedEnvTemp, setLastUpdatedEnvTemp] = useState(null);
  const [hasTempTimeout, setHasTempTimeout] = useState(false);
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
    if (selectedPersonnel?.gearId === 'pr001') {
      setIsLoadingBodyTemp(true);
      const tempRef = ref(realtimeDb, 'Temperature');
      const unsubscribeTemp = onValue(tempRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTemperature(data);
          setLastUpdatedTemp(Date.now());
          setHasTempTimeout(false); // Reset timeout state
        } else {
          setTemperature(null);
        }
        setIsLoadingBodyTemp(false);
      });
      return () => unsubscribeTemp();
    } else {
      setTemperature(null);
      setIsLoadingBodyTemp(false);
    }
  }, [selectedPersonnel]);

  // Fetch environmental temperature from Realtime Database
  useEffect(() => {
    if (selectedPersonnel?.gearId === 'pr001') {
      setIsLoadingEnvTemp(true);
      const envTempRef = ref(realtimeDb, 'EnvironmentalTemperature');
      const unsubscribeEnvTemp = onValue(envTempRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEnvironmentalTemperature(data);
          setLastUpdatedEnvTemp(Date.now());
          setHasEnvTempTimeout(false); // Reset timeout state
        } else {
          setEnvironmentalTemperature(null);
        }
        setIsLoadingEnvTemp(false);
      });
      return () => unsubscribeEnvTemp();
    } else {
      setEnvironmentalTemperature(null);
      setIsLoadingEnvTemp(false);
    }
  }, [selectedPersonnel]);

  // Handle body temperature timeout
  useEffect(() => {
    if (lastUpdatedTemp) {
      const timer = setTimeout(() => {
        if (Date.now() - lastUpdatedTemp > 30000) {
          setHasTempTimeout(true);
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedTemp]);

  // Handle environmental temperature timeout
  useEffect(() => {
    if (lastUpdatedEnvTemp) {
      const timer = setTimeout(() => {
        if (Date.now() - lastUpdatedEnvTemp > 30000) {
          setHasEnvTempTimeout(true);
        }
      }, 30000);
      return () => clearTimeout(timer);
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
      value: isLoadingBodyTemp || hasTempTimeout
        ? "Loading..."
        : temperature !== null
        ? `${temperature}°C`
        : "No data available",
      description: isLoadingBodyTemp || hasTempTimeout
        ? "Loading..."
        : temperature !== null
        ? temperature >= 40
          ? "Critical Temperature"
          : "Normal Temperature"
        : "No data available",
      warningIcon: isLoadingBodyTemp || hasTempTimeout
        ? warningIcon
        : temperature !== null
        ? temperature >= 40
          ? flamesIcon
          : likeIcon
        : warningIcon,
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
      value: isLoadingEnvTemp || hasEnvTempTimeout
        ? "Loading..."
        : environmentalTemperature !== null
        ? `${environmentalTemperature}°C`
        : "No data available",
      description: isLoadingEnvTemp || hasEnvTempTimeout
        ? "Loading..."
        : environmentalTemperature !== null
        ? environmentalTemperature >= 40
          ? "Critical Temperature"
          : "Normal Temperature"
        : "No data available",
      warningIcon: isLoadingEnvTemp || hasEnvTempTimeout
        ? warningIcon
        : environmentalTemperature !== null
        ? environmentalTemperature >= 40
          ? flamesIcon
          : likeIcon
        : warningIcon,
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
            <NotificationCard
              temperature={temperature}
              environmentalTemperature={environmentalTemperature}
              lastUpdatedTemp={lastUpdatedTemp}
              lastUpdatedEnvTemp={lastUpdatedEnvTemp}
            />
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
      </BodyCard>
    </div>
  );
}

export default MonitoringBody;
