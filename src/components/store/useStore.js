import { create } from 'zustand';
import { db } from '../../firebase/Firebase';
import { doc, setDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useStore = create((set, get) => ({
  personnel: [],
  selectedPersonnel: null,
  monitoredPersonnel: [],
  temperature: null,
  environmentalTemperature: null,
  lastUpdatedTemp: null,
  lastUpdatedEnvTemp: null,
  smokeSensor: null,
  ToxicGasSensor: null,
  HeartRate: null,
  isSaving: false,
  intervalId: null,
  sensorData: {},
  notifications: (() => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      return [];
    }
  })(),
  notificationFlags: (() => {
    try {
      return JSON.parse(localStorage.getItem('notificationFlags')) || {};
    } catch (error) {
      return {};
    }
  })(),

  // Set personnel data
  setPersonnel: (personnelData) => set({ personnel: personnelData }),

  // Select personnel
  setSelectedPersonnel: (personnel) => set({ selectedPersonnel: personnel }),

  // Set sensor data for a specific personnel
  setSensorData: (gearId, sensorType, value) => set((state) => ({
    sensorData: {
      ...state.sensorData,
      [gearId]: {
        ...state.sensorData[gearId],
        [sensorType]: value,
      },
    },
  })),

  // Set temperature data
  setTemperature: (temperatureData) => set({ temperature: temperatureData }),

  // Set environmental temperature data
  setEnvironmentalTemperature: (envTempData) => set({ environmentalTemperature: envTempData }),

  // Set last updated timestamp for body temperature
  setLastUpdatedTemp: (timestamp) => set({ lastUpdatedTemp: timestamp }),

  // Set last updated timestamp for environmental temperature
  setLastUpdatedEnvTemp: (timestamp) => set({ lastUpdatedEnvTemp: timestamp }),

  // Set smoke sensor data
  setSmokeSensor: (smokeSensorData) => set({ smokeSensor: smokeSensorData }),

  // Set toxic gas sensor data
  setToxicGasSensor: (ToxicGasData) => set({ ToxicGasSensor: ToxicGasData }),

  // Set heart rate data
  setHeartRate: (heartRateData) => set({ HeartRate: heartRateData }),

  setSavingState: (isSaving, intervalId) => {
    if (intervalId) {
      clearInterval(get().intervalId);
    }
    set({ isSaving, intervalId });
  },
  
  clearSavingState: () => {
    clearInterval(get().intervalId);
    set({ isSaving: false, intervalId: null });
  },

  // Add a new notification with error control
  addNotification: async (notification) => {
    const updatedNotification = {
      ...notification,
      id: notification.id || Date.now(), // Ensure each notification has a unique ID
      gearId: notification.gearId, // Add gearId to the notification
    };
  
    set((state) => {
      // Check if the notification already exists in the state
      // const isDuplicate = state.notifications.some(
      //   (notif) => notif.id === updatedNotification.id
      // );

  
      // if (isDuplicate) {
      //   toast.warn('Duplicate notification detected, skipping save.');
      //   return state; // Return current state without adding the duplicate
      // }
  
      // Update the state with the new notification
      const updatedNotifications = [updatedNotification, ...state.notifications];
  
      // Store the updated notifications in localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  
      return { notifications: updatedNotifications };
    });
  },

  // Clear all notifications
  clearNotifications: () => set(() => {
    localStorage.removeItem('notifications');
    toast.success('Notifications cleared successfully.');
    return { notifications: [] };
  }),

  addMonitoredPersonnel: (person) =>
    set((state) => {
      // Avoid duplicates
      if (state.monitoredPersonnel.some((p) => p.gearId === person.gearId)) return state;
      // Display toast with the personnel's name
      toast.success(`${person.name} added to monitoring.`);
      return { monitoredPersonnel: [...state.monitoredPersonnel, person] };
    }),

    removeMonitoredPersonnel: (gearId) => {
      set((state) => {
        const personToRemove = state.monitoredPersonnel.find(
          (person) => person.gearId === gearId
        );
        if (personToRemove) {
          toast.info(`${personToRemove.name} removed successfully!`);
        }
        return {
          monitoredPersonnel: state.monitoredPersonnel.filter(
            (person) => person.gearId !== gearId
          ),
        };
      });
    },

  updateNotificationState: (savedNotificationIds) => set((state) => {
    const updatedNotifications = state.notifications.map((notif) => 
      savedNotificationIds.includes(notif.id)
        ? { ...notif, saved: true }
        : notif
    );
    return { notifications: updatedNotifications };
  }),

  saveRecordings: async () => {
    const { selectedPersonnel, sensorData, updateNotificationState } = get();

    // Validate selectedPersonnel
    if (!selectedPersonnel || !selectedPersonnel.gearId) {
      toast.error('No personnel selected.');
      return;
    }

    try {
      console.log('Selected personnel:', selectedPersonnel);
      console.log('Sensor data:', sensorData[selectedPersonnel.gearId]);

      // Create or reference the main document with an auto-generated ID
      const personnelRecordsCollection = collection(db, 'personnelRecords');
      let docRef;

      if (!selectedPersonnel.autoGeneratedId) {
        // Generate auto ID and set it once
        const autoDocRef = await addDoc(personnelRecordsCollection, {
          personnelId: selectedPersonnel.id,
          personnelName: selectedPersonnel.name,
        });

        selectedPersonnel.autoGeneratedId = autoDocRef.id; // Attach auto-generated ID to personnel object
        docRef = doc(personnelRecordsCollection, autoDocRef.id);

        // Update the main document to include gearId, date, and time
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        // Update the main document to include gearId
        await setDoc(docRef, {
          gearId: selectedPersonnel.gearId, date, time,
        }, { merge: true });
      } else {
        docRef = doc(personnelRecordsCollection, selectedPersonnel.autoGeneratedId);
      }

      // Filter notifications to save only unsaved ones
      const notificationsToSave = get().notifications.filter(
        (notif) => notif.gearId === selectedPersonnel.gearId && !notif.saved
      );

      if (notificationsToSave.length > 0) {
        const notificationsCollection = collection(docRef, 'notifications');
        await Promise.all(
          notificationsToSave.map(async (notif) => {
            const q = query(notificationsCollection, where('id', '==', notif.id));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
              await addDoc(notificationsCollection, {
                id: notif.id || '',
                message: notif.message || '',
                timestamp: notif.timestamp || Date.now(),
                gearId: notif.gearId || '',
                sensor: notif.sensor || '',
                value: notif.value ?? null, // Ensure value is not undefined
                isCritical: notif.isCritical ?? false, // Default to false
                saved: true,
              });
              
            }
          })
        );

        // Update notification state to mark as saved
        updateNotificationState(notificationsToSave.map((notif) => notif.id));
      }

      // Save all real-time values
      const realTimeData = {
        bodyTemperature: sensorData[selectedPersonnel.gearId]?.bodyTemperature !== undefined ? sensorData[selectedPersonnel.gearId]?.bodyTemperature : null,
        environmentalTemperature: sensorData[selectedPersonnel.gearId]?.environmentalTemperature !== undefined ? sensorData[selectedPersonnel.gearId]?.environmentalTemperature : null,
        smokeSensor: sensorData[selectedPersonnel.gearId]?.smokeSensor !== undefined ? sensorData[selectedPersonnel.gearId]?.smokeSensor : null,
        ToxicGasSensor: sensorData[selectedPersonnel.gearId]?.ToxicGasSensor !== undefined ? sensorData[selectedPersonnel.gearId]?.ToxicGasSensor : null,
        HeartRate: sensorData[selectedPersonnel.gearId]?.HeartRate !== undefined ? sensorData[selectedPersonnel.gearId]?.HeartRate : null,
      };

      const realTimeDataRef = collection(docRef, 'realTimeData');
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();

      await addDoc(realTimeDataRef, {
        ...realTimeData,
        date,
        time,
      });

      toast.success('Recordings saved successfully.');
    } catch (error) {
      console.error('Error saving recordings:', error);
       // Ensure error is converted to a readable string
      const errorMessage = error instanceof Error ? error.message : String(error);

      toast.error(`Error saving recordings: ${errorMessage}`);
    }
  },

  // Get notification flag
  getNotificationFlag: (gearId, sensorType) => {
    return get().notificationFlags[`${gearId}-${sensorType}`] || 'none';
  },
  
  setNotificationFlag: (gearId, sensorType, value) => {
    set((state) => {
      const updatedFlags = { 
        ...state.notificationFlags, 
        [`${gearId}-${sensorType}`]: value 
      };
      localStorage.setItem('notificationFlags', JSON.stringify(updatedFlags));
      return { notificationFlags: updatedFlags };
    });
  },

  // Global notification handler
  handleSensorNotification: (gearId, sensorValue, criticalThreshold, normalThreshold, sensorName, sensorType) => {
    // Determine current condition based on thresholds
    const condition = 
      sensorValue >= criticalThreshold ? 'critical' :
      sensorValue <= normalThreshold ? 'normal' :
      null;
  
    if (condition === null) return; // No action for intermediate values
  
    const uniqueId = `${gearId}-${sensorType}-${condition}-${Date.now()}`;
    const existingNotification = get().notifications.find(notif => notif.id === uniqueId);
    const previousCondition = get().getNotificationFlag(gearId, sensorType);
  
    // Skip if the current condition is the same as the previous state
    if (previousCondition === condition) return;
  
    // Trigger notifications only on state changes
    if (condition === 'critical') {
      get().addNotification({
        id: uniqueId,
        message: `Critical ${sensorName} Detected!`,
        timestamp: Date.now(),
        gearId,
        sensor: sensorName,
        value: sensorValue,
        isCritical: true,
      });
      toast.warn(`🔥 Critical ${sensorName} Detected: ${sensorValue}`);
      get().setNotificationFlag(gearId, sensorType, 'critical');
    } else if (condition === 'normal') {
      get().addNotification({
        id: uniqueId,
        message: `${sensorName} is back to normal.`,
        timestamp: Date.now(),
        gearId,
        sensor: sensorName,
        value: sensorValue,
        isCritical: false,
      });
      toast.info(`✅ ${sensorName} is back to normal: ${sensorValue}`);
      get().setNotificationFlag(gearId, sensorType, 'normal');
    }
  },  
}));