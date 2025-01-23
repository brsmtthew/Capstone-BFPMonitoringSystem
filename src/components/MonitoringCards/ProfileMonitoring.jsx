import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

function ProfileMonitoring({ personnel }) {
  const { notifications, temperature, environmentalTemperature, smokeSensor, ToxicGasSensor, HeartRate, updateNotificationState, isSaving, intervalId, setSavingState, clearSavingState, saveRecordings } = useStore();
  const [lastSavedData, setLastSavedData] = useState({
    temperature: null,
    environmentalTemperature: null,
    smokeSensor: null,
    ToxicGasSensor: null,
    HeartRate: null,
  });

  // Refs to store the latest state values
  const temperatureRef = useRef(temperature);
  const environmentalTemperatureRef = useRef(environmentalTemperature);
  const smokeSensorRef = useRef(smokeSensor);
  const ToxicGasSensorRef = useRef(ToxicGasSensor);
  const HeartRateRef = useRef(HeartRate);

  // Update refs whenever state changes
  useEffect(() => {
    temperatureRef.current = temperature;
    environmentalTemperatureRef.current = environmentalTemperature;
    smokeSensorRef.current = smokeSensor;
    ToxicGasSensorRef.current = ToxicGasSensor;
    HeartRateRef.current = HeartRate;
  }, [temperature, environmentalTemperature, smokeSensor, ToxicGasSensor, HeartRate]);

  const handleButtonClick = () => {
    if (isSaving) {
      clearSavingState();
    } else {
      saveRecordings(); // Save immediately
      const id = setInterval(saveRecordings, 5000);
      setSavingState(true, id);
    }
  };

  return (
    <div className="h-96 w-80 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="p-2 bg-bfpNavy rounded-lg text-white flex flex-col items-start">
        {personnel ? (
          <>
            <h3 className="text-lg font-bold">{personnel.name}</h3>
            <p className="text-sm text-gray-300">{personnel.position}</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold">Select Personnel</h3>
            <p className="text-sm text-gray-300">Personnel Position</p>
          </>
        )}
      </div>
      <div className="flex-grow p-4 flex flex-col items-center justify-center">
        <div className="h-52 w-52 rounded-full overflow-hidden mb-2">
          <img
            src={personnel?.image || 'https://via.placeholder.com/300x300'}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center mt-4">
          <button
            className={`px-6 py-2 text-[18px] rounded-2xl text-white mb-2 transform transition duration-300 ${
              isSaving
                ? 'bg-bfpOrange hover:bg-red'
                : 'bg-bfpNavy hover:bg-hoverBtn'
            }`}
            onClick={handleButtonClick}
          >
            {isSaving ? 'Saving Data...' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileMonitoring;