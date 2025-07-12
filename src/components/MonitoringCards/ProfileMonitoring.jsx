import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import LocationIcon from "../pageBody/dashboardAssets/placeholder.png";
import { useAuth } from "../auth/AuthContext";
import DeletePersonnelModal from "../modal/deletePersonnelModal";

function ProfileMonitoring({ personnel }) {
  const { userData } = useAuth(); // ⬅️ get user role
  const {
    notifications,
    temperature,
    environmentalTemperature,
    smokeSensor,
    ToxicGasSensor,
    updateNotificationState,
    isSaving,
    intervalId,
    setSavingState,
    clearSavingState,
    saveRecordings,
  } = useStore();
  const [lastSavedData, setLastSavedData] = useState({
    temperature: null,
    environmentalTemperature: null,
    smokeSensor: null,
    ToxicGasSensor: null,
  });

  // Refs to store the latest state values
  const temperatureRef = useRef(temperature);
  const environmentalTemperatureRef = useRef(environmentalTemperature);
  const smokeSensorRef = useRef(smokeSensor);
  const ToxicGasSensorRef = useRef(ToxicGasSensor);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  const handleConfirmStop = () => {
    clearSavingState(personnel.gearId);
    setIsStopModalOpen(false);
  };

  // Update refs whenever state changes
  useEffect(() => {
    temperatureRef.current = temperature;
    environmentalTemperatureRef.current = environmentalTemperature;
    smokeSensorRef.current = smokeSensor;
    ToxicGasSensorRef.current = ToxicGasSensor;
  }, [temperature, environmentalTemperature, smokeSensor, ToxicGasSensor]);

  const handleButtonClick = () => {
    const gearId = personnel.gearId;

    if (isSaving[gearId]) {
      // clearSavingState(gearId);
      setIsStopModalOpen(true);
    } else {
      // Immediate save and start interval
      saveRecordings(gearId);
      const intervalId = setInterval(() => saveRecordings(gearId), 5000);
      setSavingState(gearId, true, intervalId);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg flex flex-col 
                    h-72 w-full sm:w-full md:w-full lg:w-full xl:w-96 2xl:w-96 font-montserrat">
      <div className="p-2 bg-bfpNavy rounded-t-lg text-white flex items-center justify-between">
        <div className="flex flex-col">
          {personnel ? (
            <>
              <h1 className="text-lg font-bold">{personnel.name}</h1>
              <p className="text-[12px] text-gray">{personnel.position}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold">Select Personnel</h3>
              <p className="text-[12px] text-gray-300">Personnel Position</p>
            </>
          )}
        </div>

        {personnel?.location && (
          <div className="flex items-center gap-1 text-white text-md font-medium mr-3">
            <img src={LocationIcon} alt="Location" className="w-6 h-6" />
            <span>{personnel.location}</span>
          </div>
        )}
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="rounded-full overflow-hidden mb-2 h-32 w-32 lg:h-32 lg:w-32 xl:h-32 xl:w-32 2xl:h-36 2xl:w-36">
          <img
            src={personnel?.image || "https://via.placeholder.com/300x300"}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center mt-2">
          {/* <button
            className={`px-6 py-2 text-[18px] rounded-2xl text-white mb-2 transform transition duration-300 ${
              isSaving
                ? 'bg-bfpNavy hover:bg-hoverBtn'
                : 'bg-bfpOrange hover:bg-hoverBtn'
            }`}
            onClick={handleButtonClick}
          >
            {isSaving[personnel.gearId] ? 'Saving Data...' : 'Save Record'}
          </button> */}
          {/* <button
            disabled={userData?.role !== 'admin'}
            className={`px-6 py-2 text-[18px] rounded-2xl text-white mb-2 transform transition duration-300 ${
              isSaving[personnel?.gearId]
                ? 'bg-bfpNavy hover:bg-hoverBtn'
                : 'bg-bfpOrange hover:bg-hoverBtn'
            } ${userData?.role !== 'admin' ? 'bg-gray cursor-not-allowed' : ''}`}
            onClick={handleButtonClick}
            title={userData?.role !== 'admin' ? 'Only admin can save data.' : ''}
          >
            {isSaving[personnel?.gearId] ? 'Saving Data...' : 'Save Record'}
          </button> */}
          {userData?.role === 'admin' && (
            <button
              className={`px-6 py-2 text-[18px] rounded-2xl text-white mb-2 transform transition duration-300 ${
                isSaving[personnel?.gearId]
                  ? 'bg-bfpOrange hover:bg-hoverBtn'
                  : 'bg-bfpNavy hover:bg-hoverBtn'
              }`}
              onClick={handleButtonClick}
            >
              {isSaving[personnel?.gearId] ? 'End Recording' : 'Start Recording'}
            </button>
          )}
          {/* {userData?.role === "admin" &&
          userData?.email !== "malasaga252@gmail.com" ? (
            <button
              className={`px-6 py-2 text-[18px] rounded-2xl text-white mb-2 transform transition duration-300 ${
                isSaving[personnel?.gearId]
                  ? "bg-bfpOrange hover:bg-hoverBtn"
                  : "bg-bfpNavy hover:bg-hoverBtn"
              }`}
              onClick={handleButtonClick}>
              {isSaving[personnel?.gearId] ? "Saving Data..." : "Save Record"}
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2 text-[18px] rounded-2xl text-white mb-2 bg-gray cursor-not-allowed"
              title="Access restricted for this account.">
              Save Record
            </button>
          )} */}
        </div>
      </div>
      <DeletePersonnelModal
        isOpen={isStopModalOpen}
        closeModal={() => setIsStopModalOpen(false)}
        onConfirm={handleConfirmStop}
        personnel={personnel} // optional here since you're not deleting
        customMessage="Are you sure you want to stop saving data?"
      />
    </div>
  );
}

export default ProfileMonitoring;
