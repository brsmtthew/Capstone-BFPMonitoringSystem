import { create } from 'zustand';
import { db } from '../../firebase/Firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
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
  notifications: (() => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
      return Array.isArray(storedNotifications) ? storedNotifications : [];
    } catch (error) {
      console.error('Failed to parse notifications from localStorage', error);
      return [];
    }
  })(),


  // Set personnel data
  setPersonnel: (personnelData) => set({ personnel: personnelData }),

  // Select personnel
  setSelectedPersonnel: (personnel) => set({ selectedPersonnel: personnel }),

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

  setSavingState: (isSaving, intervalId) => set({ isSaving, intervalId }),
  
  clearSavingState: () => set({ isSaving: false, intervalId: null }),

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
    
}));
