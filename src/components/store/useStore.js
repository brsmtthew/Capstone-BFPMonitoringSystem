import { create } from 'zustand';
import { db } from '../../firebase/Firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

export const useStore = create((set, get) => ({
  personnel: [],
  selectedPersonnel: null,
  temperature: null,
  environmentalTemperature: null,
  lastUpdatedTemp: null,
  lastUpdatedEnvTemp: null,
  isLoadingBodyTemp: true,
  isLoadingEnvTemp: true,
  hasTempTimeout: false,
  hasEnvTempTimeout: false,
  notifications: (() => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
      return Array.isArray(storedNotifications) ? storedNotifications : [];
    } catch (error) {
      console.error('Failed to parse notifications from localStorage', error);
      return [];
    }
  })(),
  timeoutId: null,
  timeoutStartedAt: null,
  timeoutIdTemp: null, // Added for body temperature timeout
  timeoutIdEnvTemp: null, // Added for environmental temperature timeout

  // Set personnel data
  setPersonnel: (personnelData) => set({ personnel: personnelData }),

  // Select personnel
  setSelectedPersonnel: (personnel) => set({ selectedPersonnel: personnel }),

  // Set temperature data
  setTemperature: (temperatureData) => set({ temperature: temperatureData }),

  // Set environmental temperature data
  setEnvironmentalTemperature: (envTempData) => set({ environmentalTemperature: envTempData }),

  // Set loading state for body temperature
  setIsLoadingBodyTemp: (state) => set({ isLoadingBodyTemp: state }),

  // Set loading state for environmental temperature
  setIsLoadingEnvTemp: (state) => set({ isLoadingEnvTemp: state }),

  // Handle timeout for body temperature
  setHasTempTimeout: (state) => set({ hasTempTimeout: state }),

  // Handle timeout for environmental temperature
  setHasEnvTempTimeout: (state) => set({ hasEnvTempTimeout: state }),

  // Set last updated timestamp for body temperature
  setLastUpdatedTemp: (timestamp) => set({ lastUpdatedTemp: timestamp }),

  // Set last updated timestamp for environmental temperature
  setLastUpdatedEnvTemp: (timestamp) => set({ lastUpdatedEnvTemp: timestamp }),

  // Add a new notification
  addNotification: (notification) => set((state) => {
    const updatedNotification = {
      ...notification,
      gearId: state.selectedPersonnel?.gearId || null,
      saved: true,  // Mark notification as saved immediately
    };

    // Update the state with the new notification
    const updatedNotifications = [updatedNotification, ...state.notifications];
    
    // Store the updated notifications in localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Optionally, save to Firebase (if needed)
    if (state.selectedPersonnel) {
      const docRef = doc(db, 'personnelMonitoring', state.selectedPersonnel.gearId);
      const notificationsCollection = collection(docRef, 'notifications');
      addDoc(notificationsCollection, updatedNotification);
    }

    return { notifications: updatedNotifications };
  }),

  // Clear all notifications
  clearNotifications: () => set(() => {
    localStorage.removeItem('notifications');
    return { notifications: [] };
  }),

  // Timeout management
  setTimeoutId: (id) => set({ timeoutId: id }),

  setTimeoutStartedAt: (timestamp) => set({ timeoutStartedAt: timestamp }),

  resetTimeout: (isForTemp) => {
    const timeoutId = isForTemp ? get().timeoutIdTemp : get().timeoutIdEnvTemp;
    if (timeoutId) clearTimeout(timeoutId);
    set(isForTemp ? { timeoutIdTemp: null } : { timeoutIdEnvTemp: null });
  },

  startGlobalTimeout: (callback, duration, isForTemp) => {
    const resetTimeout = get().resetTimeout;
    resetTimeout(isForTemp);

    const newTimeoutId = setTimeout(() => {
      callback();
      resetTimeout(isForTemp);
    }, duration);

    set(isForTemp ? { timeoutIdTemp: newTimeoutId } : { timeoutIdEnvTemp: newTimeoutId });
  },

  isTimeoutActive: (isForTemp) => {
    const timeoutId = isForTemp ? get().timeoutIdTemp : get().timeoutIdEnvTemp;
    return timeoutId !== null;
  },
}));
