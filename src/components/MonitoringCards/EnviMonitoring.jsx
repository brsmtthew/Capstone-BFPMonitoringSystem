import React from 'react';
import EnviCard from './EnviCard';
import DataCardMonitoring from './DataCardMonitoring';

const EnviMonitoring = () => {
  const monitoringData = [
    {
      icon: '/path/to/icon1.png',
      title: 'Temperature',
      value: '30°C',
      description: 'Normal range',
      warningIcon: '/path/to/warning1.png',
    },
    {
      icon: '/path/to/icon2.png',
      title: 'Smoke Level',
      value: 'High',
      description: 'Immediate action required',
      warningIcon: '/path/to/warning2.png',
    },
    {
      icon: '/path/to/icon3.png',
      title: 'Toxic Gas',
      value: 'Safe',
      description: '',
      warningIcon: null,
    },
  ];

  return (
    <div className="bg-black h-96 w-full rounded-lg shadow-md ">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-2">
        <p className="font-bold text-[26px]">Environmental Monitoring</p>
      </div>
      <div className="flex flex-wrap justify-around gap-4 mt-4">
        {monitoringData.map((data, index) => (
          <EnviCard key={index} icon={data.icon} title={data.title}>
            <DataCardMonitoring
              value={data.value}
              description={data.description}
              warningIcon={data.warningIcon}
            />
          </EnviCard>
        ))}
      </div>
    </div>
  );
};

export default EnviMonitoring;
