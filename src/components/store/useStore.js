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
      const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
      return Array.isArray(storedNotifications) ? storedNotifications : [];
    } catch (error) {
      toast.error('Failed to parse notifications from localStorage', error);
      return [];
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
  setToxicGasSensor: (toxicGasData) => set({ ToxicGasSensor: toxicGasData }),

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
      gearId: get().selectedPersonnel?.gearId || null, // Add gearId to the notification
    };
  
    set((state) => {
      // Check if the notification already exists in the state
      const isDuplicate = state.notifications.some((notif) => notif.id === updatedNotification.id);
  
      if (isDuplicate) {
        toast.warn('Duplicate notification detected, skipping save.');
        return state; // Return current state without adding the duplicate
      }
  
      // Update the state with the new notification
      const updatedNotifications = [updatedNotification, ...state.notifications];
  
      // Store the updated notifications in localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  
      return { notifications: updatedNotifications };
    });
  
    // Save to Firebase
    if (updatedNotification.gearId) {
      const docRef = doc(db, 'personnelRecords', updatedNotification.gearId);
      const notificationsCollection = collection(docRef, 'notifications');
  
      try {
        await addDoc(notificationsCollection, updatedNotification); // Save the enhanced notification
        toast.success('Notification saved to Firebase');
      } catch (err) {
        console.error('Error saving notification to Firebase:', err);
        toast.error('Failed to save notification to Firebase');
      }
    } else {
      toast.error('Gear ID is missing; notification not saved to Firebase.');
    }
  },

  // Clear all notifications
  clearNotifications: () => set(() => {
    localStorage.removeItem('notifications');
    return { notifications: [] };
  }),

  addMonitoredPersonnel: (person) =>
    set((state) => {
      // Avoid duplicates
      if (state.monitoredPersonnel.some((p) => p.gearId === person.gearId)) return state;
      return { monitoredPersonnel: [...state.monitoredPersonnel, person] };
    }),

  removeMonitoredPersonnel: (gearId) => set((state) => ({
    monitoredPersonnel: state.monitoredPersonnel.filter(
      (person) => person.gearId !== gearId
    ),
  })),

  updateNotificationState: (savedNotificationIds) => set((state) => {
    const updatedNotifications = state.notifications.map((notif) => 
      savedNotificationIds.includes(notif.id)
        ? { ...notif, saved: true }
        : notif
    );
    return { notifications: updatedNotifications };
  }),

  saveRecordings: async () => {
    const { selectedPersonnel, notifications, temperature, environmentalTemperature, smokeSensor, ToxicGasSensor, HeartRate, updateNotificationState } = get();

    if (!selectedPersonnel) {
      alert('Please select a personnel first.');
      return;
    }

    try {
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

        // Update the main document to include gearId
        await setDoc(docRef, {
          gearId: selectedPersonnel.gearId,
        }, { merge: true });
      } else {
        docRef = doc(personnelRecordsCollection, selectedPersonnel.autoGeneratedId);
      }

      // Filter notifications to save only unsaved ones
      const notificationsToSave = notifications.filter(
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
                ...notif,
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
        bodyTemperature: temperature,
        environmentalTemperature: environmentalTemperature,
        smokeSensor: smokeSensor,
        ToxicGasSensor: ToxicGasSensor,
        HeartRate: HeartRate,
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
      toast.error('Error saving recordings:', error);
    }
  },
}));