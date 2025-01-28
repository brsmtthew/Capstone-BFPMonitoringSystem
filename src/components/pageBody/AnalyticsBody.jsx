import React, { useEffect, useState } from 'react';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';
import HealthChartSection from '../chart/HealthChartSection';
import EnvironmentChartSection from '../chart/EnvironmentChartSection';
import { useLocation } from "react-router-dom";

const AnalyticsBody = () => {
  const location = useLocation();
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    console.log("Received Data from HistoryBody:", location.state?.realTimeData);
    if (location.state?.realTimeData) {
      setRealTimeData(location.state.realTimeData);
    }
  }, [location.state]);

  // Function to reset analytics data
  const handleReset = () => {
    setRealTimeData([]); // Clear the data
    console.log("Analytics data has been reset.");
  };

  // Function to sort data by datetime
  const sortByDateTime = (data) => {
    return data.sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      return dateTimeA - dateTimeB;
    });
  };

  // Extracting smoke sensor data
  const smokeData = sortByDateTime(
    realTimeData
      .filter((data) => data.smokeSensor !== undefined)
      .map((data) => ({
        time: data.time || "N/A",
        value: data.smokeSensor,
        date: data.date || "N/A",
      }))
  );

  // Extracting environmental temperature data
  const EnviData = sortByDateTime(
    realTimeData
      .filter((data) => data.environmentalTemperature !== undefined)
      .map((data) => ({
        time: data.time || "N/A",
        value: data.environmentalTemperature,
        date: data.date || "N/A",
      }))
  );

  const ToxicGas = sortByDateTime(
    realTimeData
      .filter((data) => data.ToxicGasSensor !== undefined)
      .map((data) => ({
        time: data.time || "N/A",
        value: data.ToxicGasSensor,
        date: data.date || "N/A",
      }))
  );

  const HeartRate = sortByDateTime(
    realTimeData
      .filter((data) => data.HeartRate !== undefined)
      .map((data) => ({
        time: data.time || "N/A",
        value: data.HeartRate,
        date: data.date || "N/A",
      }))
  );

  const temperatureData = sortByDateTime(
    realTimeData
      .filter((data) => data.bodyTemperature !== undefined)
      .map((data) => ({
        time: data.time || "N/A",
        value: data.bodyTemperature,
        date: data.date || "N/A",
      }))
  );

  console.log("Processed Smoke Data:", smokeData);
  console.log("Processed Environmental Data:", EnviData);

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white font-montserrat">
      <HeaderSection title={
        <span className="text-lg sm:text-base md:text-sm">
          ANALYTICS OVERVIEW
        </span>
      }
      extraContent={
        <button onClick={handleReset} className="bg-red text-white px-4 py-2 rounded-lg shadow-md hover:bg-opacity-80 transition">
          Reset
        </button>
      } />
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />
      <BodyCard>
        <div className="mb-6">
          <HealthChartSection HeartRate={HeartRate} temperatureData={temperatureData} />
        </div>
        <EnvironmentChartSection smokeData={smokeData} enviData={EnviData} ToxicGas={ToxicGas} />
      </BodyCard>
    </div>
  );
};

export default AnalyticsBody;