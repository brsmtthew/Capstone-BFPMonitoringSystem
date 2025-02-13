import React, { useEffect, useRef } from 'react';
import { toast } from "react-toastify";

function Notifications({ sensorData, selectedPersonnel, addNotification, setNotificationFlag, getNotificationFlag }) {
  const prevTemperature = useRef(null);
  const prevEnvTemperature = useRef(null);
  const prevSmokeSensor = useRef(null);
  const prevToxicGasSensor = useRef(null);
  const prevHeartRate = useRef(null);

  // Utility function to handle notifications
  const handleNotification = (gearId, sensor, value, threshold, criticalMessage, normalMessage) => {
    const isCritical = value >= threshold;
    const hasSentNotification = getNotificationFlag(gearId, sensor);
    // console.log("sensorData:", sensorData);
    // console.log("Selected Gear ID:", selectedPersonnel?.gearId);
    // console.log("Body Temperature Value:", sensorData[selectedPersonnel?.gearId]?.bodyTemperature);
    // console.log(sensorData);
    // console.log("Updated sensorData:", JSON.stringify(sensorData, null, 2));
    // console.log("Selected Personnel:", selectedPersonnel);
    // console.log(`Checking ${sensor}: Value=${value}, Threshold=${threshold}, Flag=${hasSentNotification}`);
    // console.log(`Checking ${sensor}: Value=${value}, Threshold=${threshold}, Flag=${hasSentNotification}`);

    // console.log(`Handling notification for ${sensor} - Value: ${value}, Critical: ${isCritical}, Flag: ${hasSentNotification}`);
    // console.log(sensorData); // Log to check if the sensor data exists
    // console.log(gearId); // Check the values of sensor data
    // console.log("Sensor Data Keys: ", Object.keys(sensorData[gearId] || {}));
    // console.log("Selected Personnel:", selectedPersonnel);
    // console.log("Updated sensorData:", JSON.stringify(sensorData, null, 2));


    if (value !== undefined && value !== null) {
      if (isCritical && !hasSentNotification) {
        const uniqueId = `${gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: criticalMessage,
          timestamp: Date.now(),
          gearId,
          sensor,
          value,
          isCritical: true,
        });
        toast.error(`🔥 ${criticalMessage} (${value})`);
        setNotificationFlag(gearId, sensor, true);
      } else if (value < threshold && hasSentNotification) {
        const uniqueId = `${gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        addNotification({
          id: uniqueId,
          message: normalMessage,
          timestamp: Date.now(),
          gearId,
          sensor,
          value,
          isCritical: false,
        });
        toast.success(`✅ ${normalMessage} (${value})`);
        setNotificationFlag(gearId, sensor, false);
      }
    }
  };

  // Monitor body temperature
  useEffect(() => {
    console.log("useEffect triggered"); // To see when the effect runs
  
    if (!selectedPersonnel?.gearId) {
      console.log("No gearId available in selectedPersonnel"); // To log when there's no gearId
      return;
    }
  
    const gearId = selectedPersonnel.gearId;
    const temperature = sensorData[gearId]?.bodyTemperature;
  
    console.log("Gear ID:", gearId); // To check the current gearId
    console.log("Temperature:", temperature); // To log the temperature value
  
    if (temperature !== prevTemperature.current && temperature != null) {
      console.log("Temperature has changed, handling notification"); // To check if the condition is met
  
      handleNotification(
        gearId,
        'bodyTemperature',
        temperature,
        40, // Trigger at 40°C or above
        'Critical Body Temperature Detected!',
        'Body Temperature is back to normal.'
      );
  
      prevTemperature.current = temperature;
    }
  }, [sensorData, selectedPersonnel]);
  

  // Monitor environmental temperature
  useEffect(() => {
    if (!selectedPersonnel?.gearId) return;
    const gearId = selectedPersonnel.gearId;
    const environmentalTemperature = sensorData[gearId]?.environmentalTemperature;

    if (environmentalTemperature !== prevEnvTemperature.current && environmentalTemperature != null) {
      handleNotification(
        gearId,
        'environmentalTemperature',
        environmentalTemperature,
        40, // Trigger at 40°C or above
        'Critical Environmental Temperature Detected!',
        'Environmental Temperature is back to normal.'
      );
      prevEnvTemperature.current = environmentalTemperature;
    }
  }, [sensorData, selectedPersonnel]);

  // Monitor smoke sensor
  useEffect(() => {
    if (!selectedPersonnel?.gearId) return;
    const gearId = selectedPersonnel.gearId;
    const smokeSensor = sensorData[gearId]?.smokeSensor;

    if (smokeSensor !== prevSmokeSensor.current && smokeSensor != null) {
      handleNotification(
        gearId,
        'smokeSensor',
        smokeSensor,
        310, // Trigger at 310 PPM or above
        'High Smoke Level Detected!',
        'Smoke Level is back to normal.'
      );
      prevSmokeSensor.current = smokeSensor;
    }
  }, [sensorData, selectedPersonnel]);

  // Monitor toxic gas sensor
  useEffect(() => {
    if (!selectedPersonnel?.gearId) return;
    const gearId = selectedPersonnel.gearId;
    const toxicGasSensor = sensorData[gearId]?.ToxicGasSensor;

    if (toxicGasSensor !== prevToxicGasSensor.current && toxicGasSensor != null) {
      handleNotification(
        gearId,
        'ToxicGasSensor',
        toxicGasSensor,
        5, // Trigger at 5 PPM or above
        'Toxic Gas Detected!',
        'Toxic Gas levels are safe again.'
      );
      prevToxicGasSensor.current = toxicGasSensor;
    }
  }, [sensorData, selectedPersonnel]);

  // Monitor heart rate
  useEffect(() => {
    if (!selectedPersonnel?.gearId) return;
    const gearId = selectedPersonnel.gearId;
    const heartRate = sensorData[gearId]?.HeartRate;

    if (heartRate !== prevHeartRate.current && heartRate != null) {
      handleNotification(
        gearId,
        'HeartRate',
        heartRate,
        120, // Trigger at 120 BPM or above
        'Elevated Heart Rate Detected!',
        'Heart Rate is back to normal.'
      );
      prevHeartRate.current = heartRate;
    }
  }, [sensorData, selectedPersonnel]);

  return null; // This component only handles side effects (notifications)
}

export default Notifications;
