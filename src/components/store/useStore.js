import { create } from 'zustand';

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
    };
    const updatedNotifications = [updatedNotification, ...state.notifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
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

  resetTimeout: () => {
    const { timeoutId } = get();
    if (timeoutId) clearTimeout(timeoutId);
    set({ timeoutId: null, timeoutStartedAt: null });
  },

  startGlobalTimeout: (callback, duration) => {
    const { timeoutId, resetTimeout } = get();
    if (timeoutId) resetTimeout(); 

    const startTimestamp = Date.now();
    const newTimeoutId = setTimeout(() => {
      callback();
      resetTimeout();
    }, duration);

    set({ timeoutId: newTimeoutId, timeoutStartedAt: startTimestamp });
  },

  isTimeoutActive: () => {
    const { timeoutStartedAt } = get();
    return timeoutStartedAt !== null;
  },
}));
