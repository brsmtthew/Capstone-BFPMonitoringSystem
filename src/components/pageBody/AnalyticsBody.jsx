import React, { useEffect, useState } from 'react';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';
import HealthChartSection from '../chart/HealthChartSection';
import EnvironmentChartSection from '../chart/EnvironmentChartSection';
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

const AnalyticsBody = () => {
  const location = useLocation();
  const [realTimeData, setRealTimeData] = useState([]);
  const [personnelInfo, setPersonnelInfo] = useState({ name: "", date: "", time: "" });
  
  useEffect(() => {
    // Load the saved data from localStorage
    const savedData = JSON.parse(localStorage.getItem('overviewData'));
    if (savedData) {
      console.log('Loading saved data');
      toast.success("Loaded the saved analytics data.");
      setRealTimeData(savedData);
    } else if (location.state?.realTimeData) {
      console.log('Loading data from location state');
      toast.success("Analytics data has been loaded.");
      setRealTimeData(location.state.realTimeData);
      //Set personnel info from location state
      const { name, date, time } = location.state;  // Extracting name, date, and time
      setPersonnelInfo({ name, date, time });
    }
  }, [location.state]);  // Ensure location changes are tracked correctly
  

  // Function to reset analytics data
  const handleReset = () => {
    setRealTimeData([]); // Clear the data
    setPersonnelInfo({ name: "", date: "", time: "" });
    localStorage.removeItem('overviewData');
    toast.info("Analytics data has been reset.");
  };

  const handleSave = () => {
    // Save the current data to localStorage
    localStorage.setItem('overviewData', JSON.stringify(realTimeData));
    toast.success("Analytics data has been saved.");
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

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white font-montserrat">
      <HeaderSection title={
        <span className="text-lg">
          ANALYTICS OVERVIEW
        </span>
      }
      extraContent={
        <>
          <button
            onClick={handleSave}
            className="bg-blue text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition mr-2"
          >
            Save
          </button>
          <button
            onClick={handleReset}
            className="bg-red text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Reset
          </button>
        </>
      } />
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />
      <BodyCard>
        <div className="mb-6">
        <div className="flex justify-center space-x-6 lg:text-[22px] mb-4">
          <div>
            <p className="font-semibold">Name: {personnelInfo.name}</p>
          </div>
          <div>
            <p className="font-semibold">Date: {personnelInfo.date}</p>
          </div>
          <div>
            <p className="font-semibold">Time: {personnelInfo.time}</p>
          </div>
        </div>
          <HealthChartSection HeartRate={HeartRate} temperatureData={temperatureData} />
        </div>
        <EnvironmentChartSection smokeData={smokeData} enviData={EnviData} ToxicGas={ToxicGas} HeartRate={HeartRate} temperatureData={temperatureData} />
      </BodyCard>
    </div>
  );
};

export default AnalyticsBody;
