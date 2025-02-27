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
  isSaving: {},
  intervalId: {},
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

  // Updated setSavingState for gearId-specific state
  setSavingState: (gearId, isSaving, intervalId) => {
    set((state) => ({
      isSaving: { ...state.isSaving, [gearId]: isSaving },
      intervalId: { ...state.intervalId, [gearId]: intervalId },
    }));
  },

  // Updated clearSavingState for gearId-specific cleanup
  clearSavingState: (gearId) => {
    const intervalId = get().intervalId[gearId];
    if (intervalId) clearInterval(intervalId);
    set((state) => ({
      isSaving: { ...state.isSaving, [gearId]: false },
      intervalId: { ...state.intervalId, [gearId]: null },
    }));
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

  saveRecordings: async (gearId) => {  // Accept gearId as parameter
    const { monitoredPersonnel, sensorData, updateNotificationState } = get();
    const personnel = monitoredPersonnel.find(p => p.gearId === gearId);
  
    if (!personnel) {
      toast.error('Personnel not found.');
      return;
    }
  
    try {
      console.log('Saving for:', personnel.gearId);
      console.log('Sensor data:', sensorData[personnel.gearId]);
  
      const personnelRecordsCollection = collection(db, 'personnelRecords');
      let docRef;
  
      // Changed all selectedPersonnel references to personnel
      if (!personnel.autoGeneratedId) {
        const autoDocRef = await addDoc(personnelRecordsCollection, {
          personnelId: personnel.id,
          personnelName: personnel.name,
        });
  
        // Update the personnel object in state
        set((state) => ({
          monitoredPersonnel: state.monitoredPersonnel.map(p => 
            p.gearId === gearId 
              ? { ...p, autoGeneratedId: autoDocRef.id }
              : p
          )
        }));
  
        docRef = doc(personnelRecordsCollection, autoDocRef.id);
        const now = new Date();
        
        await setDoc(docRef, {
          gearId: personnel.gearId,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
        }, { merge: true });
      } else {
        docRef = doc(personnelRecordsCollection, personnel.autoGeneratedId);
      }
  
      // Filter notifications by current gearId
      const notificationsToSave = get().notifications.filter(
        (notif) => notif.gearId === personnel.gearId && !notif.saved
      );
  
      if (notificationsToSave.length > 0) {
        const notificationsCollection = collection(docRef, 'notifications');
        await Promise.all(
          notificationsToSave.map(async (notif) => {
            const q = query(notificationsCollection, where('id', '==', notif.id));
            const querySnapshot = await getDocs(q);
  
            if (querySnapshot.empty) {
              await addDoc(notificationsCollection, {
                ...notif,
                saved: true,
              });
            }
          })
        );
        updateNotificationState(notificationsToSave.map((notif) => notif.id));
      }
  
      // Get sensor data for current gearId
      const realTimeData = {
        bodyTemperature: sensorData[personnel.gearId]?.bodyTemperature ?? null,
        environmentalTemperature: sensorData[personnel.gearId]?.environmentalTemperature ?? null,
        smokeSensor: sensorData[personnel.gearId]?.smokeSensor ?? null,
        ToxicGasSensor: sensorData[personnel.gearId]?.ToxicGasSensor ?? null,
        HeartRate: sensorData[personnel.gearId]?.HeartRate ?? null,
      };
  
      const realTimeDataRef = collection(docRef, 'realTimeData');
      const now = new Date();
      
      await addDoc(realTimeDataRef, {
        ...realTimeData,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
      });
  
      toast.success(`Recordings saved for ${personnel.name}`);
    } catch (error) {
      console.error('Error saving recordings:', error);
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
        message: `High ${sensorName} Detected!`,
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