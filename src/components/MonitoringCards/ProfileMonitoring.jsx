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
    <div className="bg-white rounded-lg shadow-lg flex flex-col 
                    h-72 w-72 sm:h-96 sm:w-96 md:h-96 md:w-96 
                    lg:h-96 lg:w-96 xl:h-96 xl:w-96 2xl:h-96 2xl:w-96 font-montserrat">
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
        <div className="rounded-full overflow-hidden mb-2 h-32 w-32 sm:h-32 sm:w-32 md:h-32 md:w-32 lg:h-52 lg:w-52 xl:h-52 xl:w-52">
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