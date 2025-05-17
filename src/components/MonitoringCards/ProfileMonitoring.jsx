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
    const gearId = personnel.gearId;
    
    if (isSaving[gearId]) {
      clearSavingState(gearId);
    } else {
      // Immediate save and start interval
      saveRecordings(gearId);
      const intervalId = setInterval(() => saveRecordings(gearId), 5000);
      setSavingState(gearId, true, intervalId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col 
                    h-80 w-full sm:w-full md:w-full lg:w-full xl:w-96 2xl:w-96 font-montserrat">
      <div className="p-2 bg-bfpNavy rounded-t-lg text-white flex flex-col items-start">
        {personnel ? (
          <>
            <h3 className="text-lg font-bold">{personnel.name}</h3>
            <p className="text-sm text-gray">{personnel.position}</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold">Select Personnel</h3>
            <p className="text-sm text-gray">Personnel Position</p>
          </>
        )}
      </div>
      <div className="flex-grow p-4 flex flex-col items-center justify-center">
        <div className="rounded-full overflow-hidden mb-2 h-32 w-32 lg:h-32 lg:w-32 xl:h-36 xl:w-36 2xl:h-36 2xl:w-36">
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
            {isSaving[personnel.gearId] ? 'Saving Data...' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileMonitoring;