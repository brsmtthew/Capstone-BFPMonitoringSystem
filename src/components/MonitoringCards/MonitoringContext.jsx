import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  personnel: [],
  selectedPersonnel: null,
  temperature: null,
  environmentalTemperature: null,
  toxicGas: null,
  smoke: null,
  lastUpdatedTemp: null,
  lastUpdatedEnvTemp: null,
  hasTempTimeout: false,
  hasEnvTempTimeout: false,
};

// Reducer function
function monitoringReducer(state, action) {
  switch (action.type) {
    case "SET_PERSONNEL":
      return { ...state, personnel: action.payload };
    case "SET_SELECTED_PERSONNEL":
      return { ...state, selectedPersonnel: action.payload };
    case "SET_TEMPERATURE":
      return { ...state, temperature: action.payload };
    case "SET_ENVIRONMENTAL_TEMPERATURE":
      return { ...state, environmentalTemperature: action.payload };
    case "SET_TOXIC_GAS":
      return { ...state, toxicGas: action.payload };
    case "SET_SMOKE":
      return { ...state, smoke: action.payload };
    case "SET_LAST_UPDATED_TEMP":
      return { ...state, lastUpdatedTemp: action.payload };
    case "SET_LAST_UPDATED_ENV_TEMP":
      return { ...state, lastUpdatedEnvTemp: action.payload };
    case "SET_TEMP_TIMEOUT":
      return { ...state, hasTempTimeout: action.payload };
    case "SET_ENV_TEMP_TIMEOUT":
      return { ...state, hasEnvTempTimeout: action.payload };
    default:
      return state;
  }
}

// Context and Provider
const MonitoringContext = createContext();

export const MonitoringProvider = ({ children }) => {
  const [state, dispatch] = useReducer(monitoringReducer, initialState);

  // Timeout logic for body temperature
  useEffect(() => {
    if (state.lastUpdatedTemp) {
      const timer = setTimeout(() => {
        if (Date.now() - state.lastUpdatedTemp > 30000) {
          dispatch({ type: "SET_TEMP_TIMEOUT", payload: true });
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [state.lastUpdatedTemp]);

  // Timeout logic for environmental temperature
  useEffect(() => {
    if (state.lastUpdatedEnvTemp) {
      const timer = setTimeout(() => {
        if (Date.now() - state.lastUpdatedEnvTemp > 30000) {
          dispatch({ type: "SET_ENV_TEMP_TIMEOUT", payload: true });
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [state.lastUpdatedEnvTemp]);

  return (
    <MonitoringContext.Provider value={{ state, dispatch }}>
      {children}
    </MonitoringContext.Provider>
  );
};

// Custom hook for context
export const useMonitoring = () => useContext(MonitoringContext);
