import React, { useEffect, useRef, useState, useMemo } from 'react';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';
import HealthChartSection from '../chart/HealthChartSection';
import EnvironmentChartSection from '../chart/EnvironmentChartSection';
import { useLocation } from 'react-router-dom';
import ResetIcon from './dashboardAssets/reset (1).png';
import SaveIcon from './dashboardAssets/save-instagram.png';
import Summary from '../chart/Summary';
import { toast } from 'react-toastify';

const AnalyticsBody = () => {
  const location = useLocation();
  const [realTimeData, setRealTimeData] = useState([]);
  const [personnelInfo, setPersonnelInfo] = useState({ name: '', date: '', time: '' });
  const hasShownToast = useRef(false);

  // Load saved or passed data once
  useEffect(() => {
    if (hasShownToast.current) return;
    const savedData = JSON.parse(localStorage.getItem('overviewData'));
    if (savedData) {
      toast.success('Loaded the saved analytics data.');
      setRealTimeData(savedData.realTimeData || []);
      setPersonnelInfo(savedData.personnelInfo || { name: '', date: '', time: '' });
    } else if (location.state?.realTimeData) {
      toast.success('Analytics data has been loaded.');
      setRealTimeData(location.state.realTimeData || []);
      setPersonnelInfo({
        name: location.state.name || '',
        date: location.state.date || '',
        time: location.state.time || '',
      });
    }
    hasShownToast.current = true;
  }, [location.state]);

  const handleReset = () => {
    setRealTimeData([]);
    setPersonnelInfo({ name: '', date: '', time: '' });
    localStorage.removeItem('overviewData');
    toast.info('Analytics data has been reset.');
  };

  const handleSave = () => {
    localStorage.setItem(
      'overviewData',
      JSON.stringify({ realTimeData, personnelInfo })
    );
    window.dispatchEvent(new Event('storage'));
    toast.success('Analytics data has been saved.');
  };

  // Utility: sort by datetime
  const sortByDateTime = (arr) =>
    [...arr].sort(
      (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    );

  // CHANGED: Added statistical functions for z-score and MAD filtering
  const calculateMean = (arr) => arr.reduce((sum, v) => sum + v, 0) / arr.length;
  const calculateMedian = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };
  const calculateStd = (arr, mean) =>
    Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / arr.length);
  const calculateMAD = (arr, median) => {
    const deviations = arr.map((v) => Math.abs(v - median));
    return calculateMedian(deviations);
  };

  const filterByZScore = (data, zThreshold = 3) => {
    if (!data.length) return data;
    const values = data.map((d) => d.value);
    const mean = calculateMean(values);
    const std = calculateStd(values, mean);
    return data.filter((d) => Math.abs((d.value - mean) / std) <= zThreshold);
  };

  const filterByMAD = (data, madThreshold = 3) => {
    if (!data.length) return data;
    const values = data.map((d) => d.value);
    const median = calculateMedian(values);
    const mad = calculateMAD(values, median);
    return data.filter((d) => {
      const modifiedZ = (0.6745 * (d.value - median)) / mad;
      return Math.abs(modifiedZ) <= madThreshold;
    });
  };

  // Prepare series, apply MAD for smoke/toxic, z-score for others
  const prepareSeries = (key, method) => {
    const series = (realTimeData || [])
      .filter((d) => d[key] !== undefined)
      .map((d) => ({ date: d.date, time: d.time, value: d[key] }));
    const sorted = sortByDateTime(series);
    // CHANGED: use MAD for smoke and toxic, z-score otherwise
    if (method === 'MAD') {
      return filterByMAD(sorted);
    }
    return filterByZScore(sorted);
  };

  // Prepare each series
  const smokeDataSeries = useMemo(
    () => prepareSeries('smokeSensor', 'MAD'),
    [realTimeData]
  );
  const enviDataSeries = useMemo(
    () => prepareSeries('environmentalTemperature', 'z'),
    [realTimeData]
  );
  const toxicSeries = useMemo(
    () => prepareSeries('ToxicGasSensor', 'MAD'),
    [realTimeData]
  );
  
  const temperatureDataSeries = useMemo(
    () => prepareSeries('bodyTemperature', 'z'),
    [realTimeData]
  );

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white font-montserrat">
      <HeaderSection
        title="ANALYTICS OVERVIEW"
        extraContent={
          <div className="flex space-x-5">
            {/* <div onClick={handleSave} className="cursor-pointer">
              <img src={SaveIcon} alt="Save" className="w-7 h-7" />
            </div>
            <div onClick={handleReset} className="cursor-pointer">
              <img src={ResetIcon} alt="Reset" className="w-7 h-7" />
            </div> */}
          </div>
        }
      />
      <div className="my-2 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      <BodyCard>
        <div className='mb-6'>
          <Summary 
            name={personnelInfo.name}
            date={personnelInfo.date}
            time={personnelInfo.time}
            temperatureData={temperatureDataSeries}
            smokeData={smokeDataSeries}
            enviData={enviDataSeries}
            ToxicGas={toxicSeries}
          />
        </div>

        <EnvironmentChartSection
          smokeData={smokeDataSeries}
          enviData={enviDataSeries}
          ToxicGas={toxicSeries}
          temperatureData={temperatureDataSeries}
        />
      </BodyCard>
    </div>
  );
};

export default AnalyticsBody;
