import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';

function ProfileMonitoring({ personnel }) {
  const { notifications, temperature, environmentalTemperature, updateNotificationState } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [lastSavedData, setLastSavedData] = useState({
    temperature: null,
    environmentalTemperature: null,
  });

  const saveRecordings = async () => {
    if (!personnel) {
      alert('Please select a personnel first.');
      return;
    }

    try {
      const docRef = doc(db, 'personnelMonitoring', personnel.gearId);

      // Ensure the main document exists
      await setDoc(docRef, {
        personnelId: personnel.id,
        personnelName: personnel.name,
      }, { merge: true });

      // Filter notifications to save only unsaved ones
      const notificationsToSave = notifications.filter(
        (notif) => notif.gearId === personnel.gearId && !notif.saved
      );

      if (notificationsToSave.length > 0) {
        const notificationsCollection = collection(docRef, 'notifications');
        await Promise.all(
          notificationsToSave.map((notif) =>
            addDoc(notificationsCollection, {
              ...notif,
              saved: true,
            })
          )
        );

        // Update notification state to mark as saved
        updateNotificationState(notificationsToSave.map((notif) => notif.id));
      }

      // Save real-time values only if changed
      const realTimeData = {};
      if (typeof temperature === 'number' && temperature !== lastSavedData.temperature) {
        realTimeData.bodyTemperature = temperature;
      }
      if (
        typeof environmentalTemperature === 'number' &&
        environmentalTemperature !== lastSavedData.environmentalTemperature
      ) {
        realTimeData.environmentalTemperature = environmentalTemperature;
      }

      if (Object.keys(realTimeData).length > 0) {
        const realTimeDataRef = collection(docRef, 'realTimeData');
        await addDoc(realTimeDataRef, {
          ...realTimeData,
          timestamp: Date.now(),
        });

        // Update last saved data
        setLastSavedData({
          temperature,
          environmentalTemperature,
        });
      }

      console.log('Recordings saved successfully.');
    } catch (error) {
      console.error('Error saving recordings:', error);
    }
  };

  const handleButtonClick = () => {
    if (isSaving) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsSaving(false);
    } else {
      const id = setInterval(saveRecordings, 5000);
      setIntervalId(id);
      setIsSaving(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

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
